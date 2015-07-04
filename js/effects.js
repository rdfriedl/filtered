//flood
function FloodEffect(){
	Effect.apply(this,arguments);

	this.addInput('color',new ColorInput(this));
	this.addInput('opacity',new NumberInput(this,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.FloodEffect();
	this.update();
}
FloodEffect.prototype = {
	options: {
		title: 'Flood'
	},
	update: function(){
		this.filter.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue(),
		});
	}
}
FloodEffect.prototype.constructor = FloodEffect;
FloodEffect.prototype.__proto__ = Effect.prototype;

//offset
function OffsetEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addInput('x',new NumberInput(this));
	this.addInput('y',new NumberInput(this));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.OffsetEffect();
	this.update();
}
OffsetEffect.prototype = {
	options: {
		title: 'Offset'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			dx: this.inputs.x.getValue(),
			dy: this.inputs.y.getValue(),
		})
	}
}
OffsetEffect.prototype.constructor = OffsetEffect;
OffsetEffect.prototype.__proto__ = Effect.prototype;

//GaussianBlur
function GaussianBlurEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addInput('x',new NumberInput(this,{
		min: 0,
		value: undefined
	}));
	this.addInput('y',new NumberInput(this,{
		min: 0,
		value: undefined
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.GaussianBlurEffect(0);
	this.update();
}
GaussianBlurEffect.prototype = {
	options: {
		title: 'GaussianBlur'
	},
	update: function(){
		var blur = '0';

		if(!isNaN(this.inputs.x.getValue())){
			blur = this.inputs.x.getValue();
		}

		if(!isNaN(this.inputs.y.getValue())){
			blur += ' ' + this.inputs.y.getValue();
		}

		this.filter.attr({
			in: this.inputs.in.getValue(),
			'stdDeviation': blur
		});
	}
}
GaussianBlurEffect.prototype.constructor = GaussianBlurEffect;
GaussianBlurEffect.prototype.__proto__ = Effect.prototype;

//merge
function MergeEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.MergeEffect();
	this.update();
}
MergeEffect.prototype = {
	options: {
		title: 'Merge'
	},
	update: function(){
		this.filter.clear();
		for(var i in this.inputs){
			this.filter.add(new SVG.MergeNode(this.inputs[i].getValue()));
		}
	}
}
MergeEffect.prototype.constructor = MergeEffect;
MergeEffect.prototype.__proto__ = Effect.prototype;

//composite
function CompositeEffect(){
	Effect.apply(this,arguments);

	this.addInput('operator',new SelectInput(this,{
		options: ['over','in','out','atop','xor','arithmetic']
	}));
	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.CompositeEffect();
	this.update();
}
CompositeEffect.prototype = {
	options: {
		title: 'Composite'
	},
	value: function(inputs){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			operator: this.inputs.operator.getValue()
		});
	}
}
CompositeEffect.prototype.constructor = CompositeEffect;
CompositeEffect.prototype.__proto__ = Effect.prototype;

//blend
function BlendEffect(){
	Effect.apply(this,arguments);

	this.addInput('mode',new SelectInput(this,{
		options: ['normal','multiply','screen','darken','lighten']
	}));
	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.BlendEffect();
	this.update();
}
BlendEffect.prototype = {
	options: {
		title: 'Blend'
	},
	value: function(inputs){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			mode: this.inputs.mode.getValue()
		});
	}
}
BlendEffect.prototype.constructor = BlendEffect;
BlendEffect.prototype.__proto__ = Effect.prototype;

//inputs
function InputEffect(){
	Effect.apply(this,arguments);

	this.addOutput('BackgroundImage',new EffectOutput(this,{
		title: 'BackgroundImage'
	},{
		value: 'BackgroundImage'
	}));
	this.addOutput('BackgroundAlpha',new EffectOutput(this,{
		title: 'BackgroundAlpha'
	},{
		value: 'BackgroundAlpha'
	}));
	this.addOutput('FillPaint',new EffectOutput(this,{
		title: 'FillPaint'
	},{
		value: 'FillPaint'
	}));
	this.addOutput('StrokePaint',new EffectOutput(this,{
		title: 'StrokePaint'
	},{
		value: 'StrokePaint'
	}));
	this.addOutput('SourceAlpha',new EffectOutput(this,{
		title: "SourceAlpha"
	},{
		value: 'SourceAlpha'
	}));
	this.addOutput('SourceGraphic',new EffectOutput(this,{
		title: "SourceGraphic"
	},{
		value: 'SourceGraphic'
	}));

	this.render();
}
InputEffect.prototype = {
	options: {
		title: 'Input'
	}
}
InputEffect.prototype.constructor = InputEffect;
InputEffect.prototype.__proto__ = Effect.prototype;

//output
function OutputEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "out"
	}));

	this.render();

	this.filter = new SVG.OffsetEffect()
	this.update();
}
OutputEffect.prototype = {
	options: {
		title: 'Output'
	},
	value: function(){
		return this.inputs.in.getValue();
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue() || 'SourceGraphic',
			result: 'output'
		});

		this.arange();
	}
}
OutputEffect.prototype.constructor = OutputEffect;
OutputEffect.prototype.__proto__ = Effect.prototype;