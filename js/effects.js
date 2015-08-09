//muti filter
function MultiEffect(){
	Effect.apply(this,arguments);
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
    	var a = Object.keys(this.filter);
    	var filter = this.filter[a[a.length-1]];
        page.outputEffect.filter.attr('in',filter);
    }
}
MultiEffect.prototype.constructor = MultiEffect;
MultiEffect.prototype.__proto__ = Effect.prototype;

//Shadow
function ShadowEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in', new EffectInput(this))
	this.addInput('color',new ColorInput(this));
	this.addInput('opacity',new NumberInput(this,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	}));
	this.addInput('offsetX',new NumberInput(this,{
		value: 8
	}));
	this.addInput('offsetY',new NumberInput(this,{
		value: 8
	}));
	this.addInput('blur',new NumberInput(this,{
		min: 0,
		value: 3
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

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

	this.update();
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

	this.addInput('in', new EffectInput(this))
	this.addInput('color',new ColorInput(this));
	this.addInput('opacity',new NumberInput(this,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	}));
	this.addInput('size',new NumberInput(this,{
		min: 0,
		value: 2
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

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

	this.update();
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

	this.addInput('in', new EffectInput(this))
	this.addInput('color',new ColorInput(this));
	this.addInput('opacity',new NumberInput(this,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect({
		in: this.filter.color,
		operator: 'in'
	})
	this.filter.merge = new SVG.MergeEffect();

	this.update();
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