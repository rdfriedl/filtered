var editor;
var svg = undefined;
var filter = undefined;
var previewText, previewImage;

// The Browser API key obtained from the Google Developers Console.
var pickerApiLoaded = false;
var picker;

var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#485563",
        joinstyle: "round",
        outlineColor: "#2b3e50",
        outlineWidth: 3
    },
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

function onApiLoad() {
    gapi.load('picker', {'callback': onPickerApiLoad});
}

function onPickerApiLoad() {
    pickerApiLoaded = true;
    
    picker = new google.picker.PickerBuilder().
          addView(google.picker.ViewId.IMAGE_SEARCH).
          setCallback(pickerCallback).
          build();
}

function initEditor(){
    svg = new SVG('preview-svg');
    filter = svg.filter();

    var bbox = svg.bbox();

    previewText = svg.text('Text');
    previewText.font({
        size: '120px',
        'font-family': "'Ultra', serif"
    })
    previewText.filter(filter);

    previewImage = svg.image('').loaded(function(img){
        updateImageSize(img.width/img.height);
        updatePreviewPosition();
        page.editor.preview.mode.valueHasMutated()
    });
    previewImage.filter(filter);

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

function pickerCallback(data) {
    var url = '';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        url = doc.thumbnails[doc.thumbnails.length-1][google.picker.Document.URL];
    }
    page.editor.preview.image.url(url);
}

function updatePreviewPosition(){
    var w = $('#preview-svg').width();
    var h = $('#preview-svg').height();
    previewText.center(w/2,h/2);
    previewImage.center(w/2,h/2);
}

function updateImageSize(r){
    var w = $(svg.node).width();
    var h = $(svg.node).height();
    var r = r || previewImage.width() / previewImage.height();

    if(w/h < r){
        previewImage.width(w);
        previewImage.height(w / r);
    }
    else{
        previewImage.width(h * r);
        previewImage.height(h);
    }
}

$(document).ready(function(){

    initEditor();
    editPosition.init();

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

        editor.repaintEverything();

        //load filter after editor loads
        page.editor.start();
        page.loadFilter();
    });

    $(document).on('click','[href="#"]',function(event){
        event.preventDefault();
    })

    $('.panel-heading a[data-toggle="collapse"]').parent().parent().click(function(){
        $($(this).find('a').attr('href')).collapse('toggle');
    });

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
    $(".copy").each(function(i,el){
        new ZeroClipboard(el);
    });

    $(window).resize(function(){
        updatePreviewPosition();
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
function Effect(opts,styles){
    this.id = 'Effect-' + Math.round(Math.random() * 10000);
    this.inputs = {};
    this.outputs = {};
    this.position = Object.create(this.position);

    this.options = Object.create(this.options);
    for(var i in opts){
        this.options[i] = opts[i];
    }

    this.styles = Object.create(this.styles);
    for(var i in styles){
        this.styles[i] = styles[i];
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
            icon: 'eye',
            title: 'Preivew',
            action: function(){
                this.select();
            }
        },
        {
            type: 'item',
            icon: 'object-ungroup',
            title: 'Position',
            action: function(){
                this.editPosition();
            }
        },
        {
            type: 'item',
            icon: 'trash-o',
            title: 'Delete',
            action: function(){
                this.remove();
            }
        }
    ],
    toggleButton: true,

    initElement: function(){
        this.element = $('#temp .effect').clone(true,true).attr('id',this.id).get(0);

        //apply styles
        $(this.element).css(this.styles);

        $('#editor').append(this.element);

        $(this.element).find('button.toggle').click(function(){
            $(this.element).toggleClass('collapsed');
            editor.repaintEverything();
            this.updateEndpoints();
        }.bind(this));

        $(this.element).find('a.preview').click(function(){
            this.deselect();
        }.bind(this));
    },
    initPlumb: function(){
        editor.draggable(this.element);
    },

    getValue: function(){
        return this.filter;
    },

    addInput: function(name,inputType,opts,data){
        opts = opts || {};
        data = data || {};

        data.id = data.id || name;
        opts.title = opts.title || name;

        return this.inputs[name] = new (inputType)(this,opts,data);
    },
    addOutput: function(name,outputType,opts,data){
        opts = opts || {};
        data = data || {};

        data.id = data.id || name;
        opts.title = opts.title || name;

        return this.outputs[name] = new (outputType)(this,opts,data);
    },
    removeInput: function(name){
        this.inputs[name]._remove();
        delete this.inputs[name];
    },
    removeOutput: function(name){
        this.outputs[name]._remove();
        delete this.outputs[name];
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
        editor.removeAllEndpoints(this.element);
        jsPlumb.remove(this.element);
        page.effects.removeEffect(this);
    },

    change: function(){
        this.update();
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
        $('.effect').removeClass('selected');
        $(this.element).addClass('selected');

        page.outputEffect.filter.attr('in',this.filter);
    },
    deselect: function(){
        $('.effect').removeClass('selected');

        page.outputEffect.update();
    },

    position: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    editPosition: function(){
        editPosition.editEffect(this);
    },
    setPosition: function(data){
        data = data || {};

        this.position.width = data.width || this.position.width;
        this.position.height = data.height || this.position.height;
        this.position.x = data.x || this.position.x;
        this.position.y = data.y || this.position.y;
        this.updatePostion();
    },
    getPosition: function(){
        return this.position;
    },
    updatePostion: function(){
        this.filter.width(this.position.width + '%');
        this.filter.height(this.position.height + '%');
        this.filter.x(this.position.x + '%');
        this.filter.y(this.position.y + '%');
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
        editor.repaint(this.element);
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
    id: '',
    effect: undefined,
    element: undefined,
    titleElement: undefined,
    inputElement: undefined,
    value: '',
    options: {
        title: 'input',
        value: '' //default value
    },

    getValue: function(){
        if(typeof this.value == 'function'){
            return this.value();
        }
        else{
            return this.value;
        }
    },
    getAttrValue: function(){ //returns value only when its not == to options.value
        var v = this.getValue();
        return v==this.options.value? null : v;
    },
    setValue: function(val){
        this.value = val;
    },
    change: function(){ //fires when input changes
        this.effect.change();
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
        editor.deleteEndpoint(this.endpoint)
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
    id: '',
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
        editor.deleteEndpoint(this.endpoint)
    }
}
Output.prototype.constructor = Output;