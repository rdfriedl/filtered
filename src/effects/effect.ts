import * as inputs from './inputs';
import * as outputs from './outputs';

//Effect
export interface EffectOptions{
    title: string;
}
export default class Effect{
    constructor(){
        this.id = 'Effect-' + Math.round(Math.random() * 10000);
        this.inputs = {};
        this.outputs = {};
        this.position = Object.create(this.position);

        this.options = Object.create(this.options);

        this.style = Object.create(this.style);

        this.initElement();
        this.initPlumb();

        this.updateMenu();
        this.updateElement();
    }
    id: string;
    element: HTMLElement;
    filter: svgjs.Filter;
    inputs: any = {} //array of inputs
    outputs: any = {} //array of outputs
    style: any = {}
    options: EffectOptions = {
        title: ''
    }
    menu = [
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
            icon: 'question',
            title: 'Help',
            action: function(){
                $('#help').modal('show');
                $('#help iframe').attr('src','help/index.html#'+this.filter.type+'Element');
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
    ]
    toggleButton = true

    initElement(){
        this.element = $('#temp .effect').clone(true,true).attr('id',this.id).get(0);

        this.applyStyles();

        $('#editor').append(this.element);

        $(this.element).find('button.toggle').click(function(){
            $(this.element).toggleClass('collapsed');
            this.updateEndpoints();
        }.bind(this));

        $(this.element).find('a.preview').click(function(){
            this.deselect();
        }.bind(this));
    }
    initPlumb(){
        // editor.draggable(this.element);
    }
    applyStyles(){
        //apply style
        $(this.element).css(this.style);
    }

    getValue(){
        return this.filter;
    }

    addInput(name?:string,inputType?:Function,opts?:any,data?:any){
        opts = opts || {};
        data = data || {};

        data.id = data.id || name;
        opts.title = opts.title || name;

        // this.inputs[name] = new (inputType)(this,opts,data);
        return this.inputs[name];
    }
    addOutput(name,outputType,opts,data){
        opts = opts || {};
        data = data || {};

        data.id = data.id || name;
        opts.title = opts.title || name;

        this.outputs[name] = new (outputType)(this,opts,data);
        return this.outputs[name];
    }
    removeInput(name){
        this.inputs[name]._remove();
        delete this.inputs[name];
    }
    removeOutput(name){
        this.outputs[name]._remove();
        delete this.outputs[name];
    }

    hide(){
        if(!this.filter) return;
        this.filter.remove();
    }

    show(){
        if(!this.filter) return;
        // filter.put(this.filter);
    }

    remove(){
        //remove myself
        // jsPlumb.detachAllConnections(this.element);
        // editor.removeAllEndpoints(this.element);
        // jsPlumb.remove(this.element);
        // page.effects.removeEffect(this);
        this.hide();
    }

    change(){
        this.update();
    }
    update(){ //updates its own filter element
        if(!this.filter) return;

        for(var i in this.inputs){
            this.filter.attr(i,this.inputs[i].getValue());
        }
    }
    arange(){
        this.show();
        if(this.filter) this.filter.back();

        for (var i in this.inputs) {
            if(this.inputs[i] instanceof inputs.EffectInput){
                this.inputs[i].arange();
            }
        }
    }

    select(){
        $('.effect').removeClass('selected');
        $(this.element).addClass('selected');

        // previewFilter = this.filter;
        // page.outputEffect.update();
        // page.editor.arange()
    }
    deselect(){
        $('.effect').removeClass('selected');

        // previewFilter = undefined;
        // page.outputEffect.update();
        // page.editor.arange()
    }

    toJSON(){
        var data = {
            id: this.id,
            type: this.constructor.name,
            position: {
                x: this.position.hasOwnProperty('x')? this.position.x : undefined,
                y: this.position.hasOwnProperty('y')? this.position.y : undefined,
                width: this.position.hasOwnProperty('width')? this.position.width : undefined,
                height: this.position.hasOwnProperty('height')? this.position.height : undefined
            },
            style: {
                top: this.element.style.top,
                left: this.element.style.left
            },
            inputs: {}
        };

        for(var k in this.inputs){
            var val = this.inputs[k].toJSON();
            if(val !== undefined && val !== null) data.inputs[k] = val;
        }

        var empty = function(o){return Object.keys(o).length === 0;};

        if(empty(data.inputs)) delete data.inputs;
        if(empty(data.position)) delete data.position;

        return data;
    }
    fromJSON(data,dontUpdate){
        data = data || {};

        if(data.inputs){
            for(var k in this.inputs){
                if(data.inputs[k] === null || data.inputs[k] === undefined) continue;
                this.inputs[k].fromJSON(data.inputs[k]);
            }
        }

        if(data.style){
            this.style.top = data.style.top;
            this.style.left = data.style.left;
            this.applyStyles();
            this.updateEndpoints();
        }

        if(data.position){
            if(data.position.x != null){ this.position.x = data.position.x} else { delete this.position.x}
            if(data.position.y != null){ this.position.y = data.position.y} else { delete this.position.y}
            if(data.position.width != null){ this.position.width = data.position.width} else { delete this.position.width}
            if(data.position.height != null){ this.position.height = data.position.height} else { delete this.position.height}
            this.updatePostion();
        }

        if(!dontUpdate) this.update();
    }
    fromElement(el){
        var attrs = el.attributes;
        for(var i = 0; i < attrs.length; i++){
            if(this.inputs[attrs[i].name]){
                this.inputs[attrs[i].name].fromAttr(attrs[i].value);
            }
            //dont import outputs
        }

        //read position
        var pos: any = {};
        if(attrs.getNamedItem('x')) pos.x = parseFloat(attrs.getNamedItem('x').value);
        if(attrs.getNamedItem('y')) pos.y = parseFloat(attrs.getNamedItem('y').value);
        if(attrs.getNamedItem('width')) pos.width = parseFloat(attrs.getNamedItem('width').value);
        if(attrs.getNamedItem('height')) pos.height = parseFloat(attrs.getNamedItem('height').value);
    }

    position = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    }
    editPosition(){
        // editPosition.editEffect(this);
    }
    setPosition(data){
        data = data || {};

        if(!isNaN(data.x) ){ this.position.x = data.x } else { delete this.position.x }
        if(!isNaN(data.y) ){ this.position.y = data.y } else { delete this.position.y }
        if(!isNaN(data.width) ){ this.position.width = data.width } else { delete this.position.width }
        if(!isNaN(data.height) ){ this.position.height = data.height } else { delete this.position.height }
        this.updatePostion();
    }
    resetPosition(){
        this.position = Object.create(this.constructor.prototype.position);
        this.updatePostion();
    }
    getPosition(){
        return this.position;
    }
    updatePostion(){
        // if(this.position.hasOwnProperty('x')){ this.filter.x(this.position.x + '%') } else { this.filter.attr('x',null) }
        // if(this.position.hasOwnProperty('y')){ this.filter.y(this.position.y + '%') } else { this.filter.attr('y',null) }
        // if(this.position.hasOwnProperty('width')){ this.filter.width(this.position.width + '%') } else { this.filter.attr('width',null) }
        // if(this.position.hasOwnProperty('height')){ this.filter.height(this.position.height + '%') } else { this.filter.attr('height',null) }
    }

    render(){
        var $el = $(this.element);
        var $inputs = $el.find('.effect-inputs');
        var $outputs = $el.find('.effect-outputs');

        $inputs.children().remove();
        for (var i in this.inputs) {
            this.inputs[i].updateElement();
            $inputs.append(this.inputs[i].render());
            if(this.inputs[i] instanceof inputs.EffectInput || this.inputs[i] instanceof outputs.EffectOutput) this.inputs[i].updateEndpointPosition();
        }

        $outputs.children().remove();
        for (var k in this.outputs) {
            this.outputs[k].updateElement();
            $outputs.append(this.outputs[k].render());
            if(this.outputs[k] instanceof inputs.EffectInput || this.outputs[k] instanceof outputs.EffectOutput) this.outputs[k].updateEndpointPosition();
        }
    }
    updateElement(){
        var $el = $(this.element);
        $el.find('.panel-heading .effect-title').text(this.options.title);
    }
    updateEndpoints(){
        for (var i in this.inputs) {
            if(this.inputs[i] instanceof inputs.EffectInput || this.inputs[i] instanceof outputs.EffectOutput) this.inputs[i].updateEndpointPosition();
        }

        for (var k in this.outputs) {
            if(this.outputs[k] instanceof inputs.EffectInput || this.outputs[k] instanceof outputs.EffectOutput) this.outputs[k].updateEndpointPosition();
        }
        // editor.repaintEverything();
    }
    updateMenu(){
        var $item = $('<li><a href="#"><i class="fa"></i> <span></span></a></li>');
        var $separator = $('<li role="separator" class="divider"></li>');
        var $el = $(this.element);
        var $menu = $el.find('.dropdown-menu');

        //clear
        $menu.children().remove();

        if(this.menu.length === 0)
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
        }

        if(this.toggleButton){
            $el.find('button.toggle').show();
        }
        else $el.find('button.toggle').hide();
    }
}
