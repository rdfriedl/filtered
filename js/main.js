var editor;
var svg = undefined;
var filter = undefined;
var text = undefined;
var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#485563",
        joinstyle: "round",
        outlineColor: "#2b3e50",
        outlineWidth: 3
    },
// .. and this is the hover style.
    connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#528705",
        outlineWidth: 2,
        outlineColor: "#2b3e50"
    },
    endpointHoverStyle = {
        fillStyle: "#7AB02C",
        strokeStyle: "#7AB02C"
    },
// the definition of source endpoints (the small blue ones)
// the definition of target endpoints (will appear when the user drags a connection)
    outputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: {
            strokeStyle: "#528705",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        maxConnections: 100
    },
    inputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: { fillStyle: "#528705", radius: 11 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        maxConnections: 1
    };

function initEditor(){
    svg = new SVG('preview');
    filter = svg.filter();

    var bbox = svg.bbox();
    text = svg.text('Text');
    text.font({
        size: '120px',
        'font-family': "'Ultra', serif"
    })
    text.filter(filter);

    editor = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", { location: 1 } ]
        ],
        Container: "editor"
    });
}

function updateTextPostion(){
    text.center($('#preview').width()/2,$('#preview').height()/2);
}

$(document).ready(function(){

    initEditor();

    // suspend drawing and initialise.
    editor.batch(function () {

        // make all the effect divs draggable
        editor.draggable(jsPlumb.getSelector("#editor .effect"));

        editor.bind('connection',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionEvent(info.sourceEndpoint.getParameter('this'));
            }
            page.editor.arange();
        })

        editor.bind('connectionDetached',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionDetachedEvent();
            }
            page.editor.arange();
        })

        editor.bind('connectionMoved',function(info){
            if(info.originalTargetEndpoint.getParameter('this') instanceof EffectInput){
                info.originalTargetEndpoint.getParameter('this').connectionDetachedEvent();
            }
            if(info.newTargetEndpoint.getParameter('this') instanceof EffectInput){
                info.newTargetEndpoint.getParameter('this').connectionDetachedEvent(info.newSourceEndpoint.getParameter('this'));
            }
            // page.editor.arange(); dont need to arange
        })
    });

    jsPlumb.fire("jsPlumbDemoLoaded", editor);

    page.editor.start();

    $(document).on('click','[href="#"]',function(event){
        event.preventDefault();
    })

    //zoom
    var editorScale = 1;
    $('.editor-controls').mousewheel(function(event){
        if(event.deltaY > 0){
            page.editor.zoom.zoomIn();
        }
        else{
            page.editor.zoom.zoomOut();
        }
    })

    //copy
    new ZeroClipboard($("#copy")[0]);

    $('#editor').click(function(event){
        if($('.effect, .effect *').find(event.target).length > 0) return;

        $('.effect').removeClass('selected');
        page.outputEffect.update();
    });

    $(window).resize(function(){
        updateTextPostion();
    })
    $(window).trigger('resize');
});

SVG.Filter.prototype.put = function(element, i) {
    this.add(element, i)
    
    if(!element.attr('result')){
        element.attr('result',element);
    }
    
    return element;
}

//effect
function Effect(opts){
    this.id = 'Effect-' + Math.round(Math.random() * 10000);
    this.inputs = {};
    this.outputs = {};

    this.options = Object.create(this.options);
    for(var i in opts){
        this.options[i] = opts[i];
    }

    this.initElement();
    this.initPlumb();

    this.updateElement();
    this.updateMenu();
}
Effect.prototype = {
    id: '',
    element: undefined,
    filter: undefined,
    inputs: {}, //array of inputs
    outputs: {}, //array of outputs
    styles: {},
    options: {
        title: ''
    },
    menu: [
        {
            type: 'item',
            icon: 'trash-o',
            title: 'Delete',
            action: function(){
                this.remove();
            }
        }
    ],
    canSelect: true,
    toggleButton: true,
    plumb: undefined,

    initElement: function(){
        this.element = $('#temp .effect').clone(true,true).attr('id',this.id).get(0);

        //apply styles
        $(this.element).css(this.styles);

        $('#editor').append(this.element);

        $(this.element).find('button.toggle').click(function(){
            $(this.element).toggleClass('collapsed');
            this.updateEndpoints();
        }.bind(this))

        //select this element
        this.canSelect && $(this.element).mousedown(function(event){
            $('.effect').removeClass('selected');
            $(event.currentTarget).addClass('selected');

            this.select();
        }.bind(this));
    },
    initPlumb: function(){
        this.plumb = editor.draggable(this.element);
    },

    getValue: function(){
        return this.filter;
    },

    addInput: function(name,input){
        this.inputs[name] = input;
        input.options.title = input.options.title || name;
        // this.render();
        return input;
    },
    addOutput: function(name,output){
        this.outputs[name] = output;
        output.options.title = output.options.title || name;
        // this.render();
        return output;
    },
    removeInput: function(name){
        this.inputs[name]._remove();
        delete this.inputs[name];
        // this.render();
    },
    removeOutput: function(name){
        this.outputs[name]._remove();
        delete this.outputs[name];
        // this.render();
    },

    hide: function(){
        if(!this.filter) return;
        this.filter.remove();
    },

    show: function(){
        if(!this.filter) return;
        filter.put(this.filter);
    },

    remove: function(){
        //remove myself
        jsPlumb.detachAllConnections(this.element);
        this.plumb.removeAllEndpoints(this.element);
        jsPlumb.remove(this.element);
    },

    update: function(){ //updates its own filter element
        if(!this.filter) return;

        for(var i in this.inputs){
            this.filter.attr(i,this.inputs[i].getValue());
        }
    },
    arange: function(){
        this.show();
        
        for (var i in this.inputs) {
            if(this.inputs[i] instanceof EffectInput){
                this.inputs[i].arange();
            }
        };

        if(this.filter){
            this.filter.front();
        }
    },
    select: function(){
        page.outputEffect.filter.attr('in',this.filter);
    },

    render: function(){
        var $el = $(this.element);
        var $inputs = $el.find('.effect-inputs');
        var $outputs = $el.find('.effect-outputs');

        $inputs.children().remove();
        for (var i in this.inputs) {
            this.inputs[i].updateElement();
            $inputs.append(this.inputs[i].render());
            if(this.inputs[i] instanceof EffectInput || this.inputs[i] instanceof EffectOutput) this.inputs[i].updateEndpointPosition();
        };

        $outputs.children().remove();
        for (var i in this.outputs) {
            this.outputs[i].updateElement();
            $outputs.append(this.outputs[i].render());
            if(this.outputs[i] instanceof EffectInput || this.outputs[i] instanceof EffectOutput) this.outputs[i].updateEndpointPosition();
        };
    },
    updateElement: function(){
        var $el = $(this.element);
        $el.find('.effect-title').text(this.options.title);
    },
    updateEndpoints: function(){
        for (var i in this.inputs) {
            if(this.inputs[i] instanceof EffectInput || this.inputs[i] instanceof EffectOutput) this.inputs[i].updateEndpointPosition();
        };

        for (var i in this.outputs) {
            if(this.outputs[i] instanceof EffectInput || this.outputs[i] instanceof EffectOutput) this.outputs[i].updateEndpointPosition();
        };
        this.plumb.repaint(this.element);
    },
    updateMenu: function(){
        var $item = $('<li><a href="#"><i class="fa"></i> <span></span></a></li>');
        var $separator = $('<li role="separator" class="divider"></li>');
        var $el = $(this.element);
        var $menu = $el.find('.dropdown-menu');

        //clear
        $menu.children().remove();

        if(this.menu.length == 0)
            $el.find('button.options').hide();
        else 
            $el.find('button.options').show();

        for (var i = 0; i < this.menu.length; i++) {
            var item = this.menu[i];

            switch(item.type){
                case 'item':
                   var a = $item.clone();
                   a.find('span').text(item.title);
                   a.click(item.action.bind(this));
                   if(item.icon) a.find('i').addClass('fa-' + item.icon);

                   $menu.append(a);
                    break;
                case 'separator':
                    $menu.append($separator.clone());
                    break;
            }
        };

        if(this.toggleButton){
            $el.find('button.toggle').show();
        }
        else $el.find('button.toggle').hide();
    }
}
Effect.prototype.constructor = Effect;

//input
function Input(effect,opts,data){
    this.effect = effect;

    this.options = Object.create(this.options);
    for(var i in opts){
        this.options[i] = opts[i];
    }

    for(var i in data){
        this[i] = data[i];
    }
}
Input.prototype = {
    effect: undefined,
    element: undefined,
    titleElement: undefined,
    inputElement: undefined,
    value: '',
    options: {
        title: 'input'
    },

    getValue: function(){
        if(typeof this.value == 'function'){
            return this.value();
        }
        else{
            return this.value;
        }
    },
    change: function(){ //fires when input changes
        this.effect.update();
    },
    toString: function(){
        return this.getValue();
    },
    show: function(){
        $(this.element).show();
    },
    hide: function(){
        $(this.element).hide();
    },
    render: function(){
        if(!this.effect) return;
        // return $('#temp .effect-input').clone().get(0);
    },
    updateElement: function(){
        if(this.options.title){
            $(this.titleElement).show().text(this.options.title);
        }
        else $(this.titleElement).hide();
    },
    _remove: function(){
        this.effect.plumb.deleteEndpoint(this.endpoint)
    }
}
Input.prototype.constructor = Input;

//Output
function Output(effect,opts,data){
    this.effect = effect;

    this.options = Object.create(this.options);
    for(var i in opts){
        this.options[i] = opts[i];
    }

    for(var i in data){
        this[i] = data[i];
    }
}
Output.prototype = {
    effect: undefined,
    value: '',
    options: {
        title: 'output'
    },

    getValue: function(){
        if(typeof this.value == 'function'){
            return this.value();
        }
        else{
            return this.value;
        }
    },
    toString: function(){
        return this.getValue();
    },
    show: function(){
        $(this.element).show();
    },
    hide: function(){
        $(this.element).hide();
    },
    render: function(){
        if(!this.effect) return;
        // return $('#temp .effect-input').clone().get(0);
    },
    updateElement: function(){

    },
    _remove: function(){
        this.effect.plumb.deleteEndpoint(this.endpoint)
    }
}
Output.prototype.constructor = Output;