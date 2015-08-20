"use strict";

//Effect
function Effect(style){
    this.id = 'Effect-' + Math.round(Math.random() * 10000);
    this.inputs = {};
    this.outputs = {};
    this.position = Object.create(this.position);

    this.options = Object.create(this.options);

    this.style = Object.create(this.style);
    for(var i in style){
        this.style[i] = style[i];
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
    style: {},
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
    ],
    toggleButton: true,

    initElement: function(){
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
    },
    initPlumb: function(){
        editor.draggable(this.element);
    },
    applyStyles: function(){
        //apply style
        $(this.element).css(this.style);
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

    toJSON: function(){
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

        var empty = function(o){return Object.keys(o).length==0};   
        
        if(empty(data.inputs)) delete data.inputs;
        if(empty(data.position)) delete data.position;

        return data;
    },
    fromJSON: function(data,dontUpdate){
        data = data || {};

        if(data.inputs){
            for(var k in this.inputs){
                if(!data.inputs[k]) continue;
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
            if(data.position.x){ this.position.x = data.position.x } else { delete this.position.x};
            if(data.position.y){ this.position.y = data.position.y } else { delete this.position.y};
            if(data.position.width){ this.position.width = data.position.width } else { delete this.position.width};
            if(data.position.height){ this.position.height = data.position.height } else { delete this.position.height};
            this.updatePostion();
        }

        if(!dontUpdate) this.update();
    },
    fromElement: function(el){
        var attrs = el.attributes;
        for(var i = 0; i < attrs.length; i++){
            if(this.inputs[attrs[i].name]){
                this.inputs[attrs[i].name].fromAttr(attrs[i].value);
            }
            //dont import outputs
        }

        //read position
        var pos = {};
        if(attrs.getNamedItem('x')) pos.x = parseFloat(attrs.getNamedItem('x').value);
        if(attrs.getNamedItem('y')) pos.y = parseFloat(attrs.getNamedItem('y').value);
        if(attrs.getNamedItem('width')) pos.width = parseFloat(attrs.getNamedItem('width').value);
        if(attrs.getNamedItem('height')) pos.height = parseFloat(attrs.getNamedItem('height').value);
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

        if(!isNaN(data.x) ){ this.position.x = data.x } else { delete this.position.x };
        if(!isNaN(data.y) ){ this.position.y = data.y } else { delete this.position.y };
        if(!isNaN(data.width) ){ this.position.width = data.width } else { delete this.position.width };
        if(!isNaN(data.height) ){ this.position.height = data.height } else { delete this.position.height };
        this.updatePostion();
    },
    resetPosition: function(){
        this.position = Object.create(this.__proto__.position);
        this.updatePostion();
    },
    getPosition: function(){
        return this.position;
    },
    updatePostion: function(){
        if(this.position.hasOwnProperty('x')){ this.filter.x(this.position.x + '%') } else { this.filter.attr('x',null) };
        if(this.position.hasOwnProperty('y')){ this.filter.y(this.position.y + '%') } else { this.filter.attr('y',null) };
        if(this.position.hasOwnProperty('width')){ this.filter.width(this.position.width + '%') } else { this.filter.attr('width',null) };
        if(this.position.hasOwnProperty('height')){ this.filter.height(this.position.height + '%') } else { this.filter.attr('height',null) };
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
        editor.repaintEverything();
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

//muti filter
function MultiEffect(){
	Effect.apply(this,arguments);

    for(var i = 0; i < this.menu.length; i++){
        if(this.menu[i].title == 'Help'){
            this.menu.splice(i,1);
            break;
        }
    }
    this.updateMenu();
}
MultiEffect.prototype = {
	options: {
		title: 'Multi'
	},
	getValue: function(){
		var a = Object.keys(this.filter);
		return this.filter[a[a.length-1]];
	},
	hide: function(){
		for(var i in this.filter){
			this.filter[i].remove();
		}
	},
	show: function(){
		for(var i in this.filter){
			filter.put(this.filter[i]);
		}
	},
	arange: function(){
        this.show();
        
        for (var i in this.inputs) {
            if(this.inputs[i] instanceof EffectInput){
                this.inputs[i].arange();
            }
        };

        var a = Object.keys(this.filter);
        for (var i = 0; i < a.length; i++) {
            this.filter[a[i]].front();
        }
	},
    select: function(){
        $('.effect').removeClass('selected');
        $(this.element).addClass('selected');

    	var a = Object.keys(this.filter);
    	var filter = this.filter[a[a.length-1]];
        page.outputEffect.filter.attr('in',filter);
    },
    updatePostion: function(){
    	for(var i in this.filter){
            if(this.position.hasOwnProperty('x')){ this.filter[i].x(this.position.x + '%') } else { this.filter[i].attr('x',null) };
            if(this.position.hasOwnProperty('y')){ this.filter[i].y(this.position.y + '%') } else { this.filter[i].attr('y',null) };
            if(this.position.hasOwnProperty('width')){ this.filter[i].width(this.position.width + '%') } else { this.filter[i].attr('width',null) };
            if(this.position.hasOwnProperty('height')){ this.filter[i].height(this.position.height + '%') } else { this.filter[i].attr('height',null) };
    	}
    }
}
MultiEffect.prototype.constructor = MultiEffect;
MultiEffect.prototype.__proto__ = Effect.prototype;

//Shadow
function ShadowEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput)
	this.addInput('color',ColorInput);
	this.addInput('opacity',NumberInput,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	});
	this.addInput('offsetX',NumberInput,{
		value: 8
	});
	this.addInput('offsetY',NumberInput,{
		value: 8
	});
	this.addInput('blur',NumberInput,{
		min: 0,
		value: 3
	});
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect({
		in: this.filter.color,
		operator: 'in'
	})
	this.filter.offset = new SVG.OffsetEffect({
		in: this.filter.composite
	});
	this.filter.blur = new SVG.GaussianBlurEffect(0,{
		in: this.filter.offset
	});
	this.filter.merge = new SVG.MergeEffect();

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
ShadowEffect.prototype = {
	options: {
		title: 'Shadow'
	},
	update: function(){
		this.filter.composite.attr('in2',this.inputs.in.getValue());

		this.filter.merge.clear();
		this.filter.merge.add(new SVG.MergeNode({
			in: this.filter.blur
		}));
		this.filter.merge.add(new SVG.MergeNode({
			in:this.inputs.in.getValue()
		}));

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		})
		this.filter.offset.attr({
			dx: this.inputs.offsetX.getValue(),
			dy: this.inputs.offsetY.getValue()
		})
		this.filter.blur.attr({
			stdDeviation: this.inputs.blur.getValue(),
		})
	}
}
ShadowEffect.prototype.constructor = ShadowEffect;
ShadowEffect.prototype.__proto__ = MultiEffect.prototype;

//Stroke
function StrokeEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput)
	this.addInput('color',ColorInput);
	this.addInput('opacity',NumberInput,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	});
	this.addInput('size',NumberInput,{
		min: 0,
		value: 2
	});
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect({
		in: this.filter.color,
		operator: 'in'
	})
	this.filter.stroke = new SVG.MorphologyEffect('dilate',{
		in: this.filter.composite
	});
	this.filter.merge = new SVG.MergeEffect();

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
StrokeEffect.prototype = {
	options: {
		title: 'Stroke'
	},
	update: function(){
		this.filter.composite.attr('in2',this.inputs.in.getValue());

		this.filter.merge.clear();
		this.filter.merge.add(new SVG.MergeNode({
			in: this.filter.stroke
		}));
		this.filter.merge.add(new SVG.MergeNode({
			in:this.inputs.in.getValue()
		}));

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		})
		this.filter.stroke.attr({
			radius: this.inputs.size.getValue()
		})
	}
}
StrokeEffect.prototype.constructor = StrokeEffect;
StrokeEffect.prototype.__proto__ = MultiEffect.prototype;

//Recolor
function RecolorEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput)
	this.addInput('color',ColorInput);
	this.addInput('opacity',NumberInput,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	});
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect({
		in: this.filter.color,
		operator: 'in'
	})
	this.filter.merge = new SVG.MergeEffect();

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
RecolorEffect.prototype = {
	options: {
		title: 'Recolor'
	},
	update: function(){
		this.filter.composite.attr('in2',this.inputs.in.getValue());

		this.filter.merge.clear();
		this.filter.merge.add(new SVG.MergeNode({
			in:this.inputs.in.getValue()
		}));
		this.filter.merge.add(new SVG.MergeNode({
			in: this.filter.composite
		}));

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		})
	}
}
RecolorEffect.prototype.constructor = RecolorEffect;
RecolorEffect.prototype.__proto__ = MultiEffect.prototype;

//Sepiatone
function SepiatoneEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput)
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.matrix = new SVG.ColorMatrixEffect('matrix', 
		[ .343, .669, .119, 0, 0 
        , .249, .626, .130, 0, 0
        , .172, .334, .111, 0, 0
        , .000, .000, .000, 1, 0 ]);

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
SepiatoneEffect.prototype = {
	options: {
		title: 'Sepiatone'
	},
	update: function(){

	}
}
SepiatoneEffect.prototype.constructor = SepiatoneEffect;
SepiatoneEffect.prototype.__proto__ = MultiEffect.prototype;

//GreyScale
function GreyScaleEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput)
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.matrix = new SVG.ColorMatrixEffect('matrix', 
		[ .333, .333, .333, 0, 0 
        , .333, .333, .333, 0, 0
        , .333, .333, .333, 0, 0
        , .000, .000, .000, 1, 0 ]);

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
GreyScaleEffect.prototype = {
	options: {
		title: 'GreyScale'
	},
	update: function(){

	}
}
GreyScaleEffect.prototype.constructor = GreyScaleEffect;
GreyScaleEffect.prototype.__proto__ = MultiEffect.prototype;

//Bump
function BumpEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput)
	this.addInput('amount',NumberInput,{
		min: 0,
		step: 1
	})
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.matrix = new SVG.ConvolveMatrixEffect('');

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
BumpEffect.prototype = {
	options: {
		title: 'Bump'
	},
	update: function(){
		var v = this.inputs.amount.getValue();
		this.filter.matrix.attr({
            in: this.inputs.in.getValue(),
			order: 3,
			kernelMatrix: v+' 0 0 0 1 0 0 0 -'+v
		})
	}
}
BumpEffect.prototype.constructor = BumpEffect;
BumpEffect.prototype.__proto__ = MultiEffect.prototype;

//HueRotate
function HueRotateEffect(){
    MultiEffect.apply(this,arguments);

    this.addInput('in',EffectInput);
    this.addInput('amount',RangeInput,{
        min: 0,
        max: 360,
        value: 180,
        step: 1
    })
    this.addOutput('result',EffectOutput);

    this.filter = {};
    this.filter.colorMatrix = new SVG.ColorMatrixEffect('hueRotate');

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
HueRotateEffect.prototype = {
    options: {
        title: 'HueRotate'
    },
    update: function(){
        this.filter.colorMatrix.attr({
            in: this.inputs.in.getValue(),
            values: this.inputs.amount.getValue()
        })
    }
}
HueRotateEffect.prototype.constructor = HueRotateEffect;
HueRotateEffect.prototype.__proto__ = MultiEffect.prototype;