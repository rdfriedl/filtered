var editor;
var svg = undefined;
var filter = undefined;
var text = undefined;
var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#61B7CF",
        joinstyle: "round",
        outlineColor: "white",
        outlineWidth: 2
    },
// .. and this is the hover style.
    connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#216477",
        outlineWidth: 2,
        outlineColor: "white"
    },
    endpointHoverStyle = {
        fillStyle: "#216477",
        strokeStyle: "#216477"
    },
// the definition of source endpoints (the small blue ones)
// the definition of target endpoints (will appear when the user drags a connection)
    outputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: {
            strokeStyle: "#7AB02C",
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
        paintStyle: { fillStyle: "#7AB02C", radius: 11 },
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

    editor.registerConnectionType("error", {
        connector: "StateMachine",
        paintStyle: { strokeStyle: "red", lineWidth: 4 },
        hoverPaintStyle: { strokeStyle: "darkred" }
    });
}

$(document).ready(function(){

    initEditor();

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            editor.addEndpoint("flowchart" + toId, inputEndPoint, {
                anchor: sourceAnchors[i], 
                uuid: sourceUUID
            });
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            editor.addEndpoint("flowchart" + toId, outputEndPoint, { 
                anchor: targetAnchors[j], 
                uuid: targetUUID 
            });
        }
    };

    // suspend drawing and initialise.
    editor.batch(function () {

        // _addEndpoints("Effect4", ["BottomCenter"], ["LeftMiddle", "RightMiddle"]);
        // _addEndpoints("Effect2", ["LeftMiddle", "BottomCenter"], ["RightMiddle"]);
        // _addEndpoints("Effect3", ["RightMiddle", "BottomCenter"], ["LeftMiddle"]);
        // _addEndpoints("Effect1", ["LeftMiddle", "RightMiddle"], ["BottomCenter"]);

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        // editor.bind("connection", function (connInfo, originalEvent) {
        //     init(connInfo.connection);
        // });

        // make all the effect divs draggable
        editor.draggable(jsPlumb.getSelector("#editor .effect"));
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".effect"), { grid: [20, 20] });

        // connect a few up
        // editor.connect({uuids: ["Effect2BottomCenter", "Effect3TopCenter"], editable: true});
        // editor.connect({uuids: ["Effect2LeftMiddle", "Effect4LeftMiddle"], editable: true});
        // editor.connect({uuids: ["Effect4TopCenter", "Effect4RightMiddle"], editable: true});
        // editor.connect({uuids: ["Effect3RightMiddle", "Effect2RightMiddle"], editable: true});
        // editor.connect({uuids: ["Effect4BottomCenter", "Effect1TopCenter"], editable: true});
        // editor.connect({uuids: ["Effect3BottomCenter", "Effect1BottomCenter"], editable: true});
        //

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        editor.bind("click", function (conn, originalEvent) {
           // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
             //   editor.detach(conn);
            conn.toggleType("error");
        });

        editor.bind('connection',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionEvent(info.sourceEndpoint.getParameter('this'));
            }
        })

        editor.bind('connectionDetached',function(info){
            if(info.targetEndpoint.getParameter('this') instanceof EffectInput){
                info.targetEndpoint.getParameter('this').connectionDetachedEvent(info.sourceEndpoint.getParameter('this'));
            }
        })

        // editor.bind("connectionDrag", function (connection) {
        //     console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        // });

        // editor.bind("connectionDragStop", function (connection) {
        //     console.log("connection " + connection.id + " was dragged");
        // });

        // editor.bind("connectionMoved", function (params) {
        //     console.log("connection " + params.connection.id + " was moved");
        // });
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

    $(window).resize(function(){
        text.center($('#preview').width()/2,$('#preview').height()/2);
    })
    $(window).trigger('resize');
});

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
    this.render();
}
Effect.prototype = {
    id: '',
    element: undefined,
    filter: undefined,
    inputs: {}, //array of inputs
    outputs: {}, //array of outputs
    options: {
        title: ''
    },
    plumb: undefined,

    initElement: function(){
        this.element = $('#temp .effect').clone(true,true).attr('id',this.id).get(0);

        $('#editor').append(this.element);
    },
    initPlumb: function(){
        this.plumb = editor.draggable(this.element);
    },

    addInput: function(name,input){
        this.inputs[name] = input;
    },
    addOutput: function(name,output){
        this.outputs[name] = output;
    },
    removeAllInputs: function(){
        this.inputs = {};
        this.render();
    },
    removeAllOutputs: function(){
        this.outputs = {};
        this.render();
    },

    hide: function(){
        if(!this.filter) return;
        this.filter.hide();
    },

    show: function(){
        if(!this.filter) return;
        this.filter.show();
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

        if(this.filter instanceof SVG.Effect || this.filter instanceof SVG.ParentEffect){
            this.filter.front();
        }
        else if(typeof this.filter == 'object'){
            for(var i in this.filter){
                if(this.filter[i] instanceof SVG.Effect){
                    this.filter[i].front();
                }
            }
        }
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
    render: function(){
        if(!this.effect) return;
        // return $('#temp .effect-input').clone().get(0);
    },
    updateElement: function(){

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
    render: function(){
        if(!this.effect) return;
        // return $('#temp .effect-input').clone().get(0);
    },
    updateElement: function(){

    }
}
Output.prototype.constructor = Output;