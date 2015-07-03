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
	this.addOutput('out',new EffectOutput(this));

	this.render();
}
FloodEffect.prototype = {
	options: {
		title: 'Flood'
	},
	value: function(){
		var f = new SVG.FloodEffect({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue(),
		});
		filter.put(f);
		return f;
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
	this.addOutput('out',new EffectOutput(this));

	this.render();
}
OffsetEffect.prototype = {
	options: {
		title: 'Offset'
	},
	value: function(){
		var f = new SVG.OffsetEffect({
			in: this.inputs.in.getValue(),
			dx: this.inputs.x.getValue(),
			dy: this.inputs.y.getValue(),
		})
		filter.put(f);
		return f;
	}
}
OffsetEffect.prototype.constructor = OffsetEffect;
OffsetEffect.prototype.__proto__ = Effect.prototype;

//merge
function MergeEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addOutput('out',new EffectOutput(this));

	this.render();
}
MergeEffect.prototype = {
	options: {
		title: 'Merge'
	},
	value: function(inputs){
		var f = new SVG.MergeEffect();
		for(var i in this.inputs){
			f.add(new SVG.MergeNode(this.inputs[i].getValue()));
		}
		filter.put(f);
		return f;
	}
}
MergeEffect.prototype.constructor = MergeEffect;
MergeEffect.prototype.__proto__ = Effect.prototype;

//merge
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
	this.addOutput('out',new EffectOutput(this));

	this.render();
}
CompositeEffect.prototype = {
	options: {
		title: 'Composite'
	},
	value: function(inputs){
		// var f = new SVG.CompositeEffect('testing','out');
		// return f;
	}
}
CompositeEffect.prototype.constructor = CompositeEffect;
CompositeEffect.prototype.__proto__ = Effect.prototype;

//output
function OutputEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "out"
	}));

	this.render();
}
OutputEffect.prototype = {
	options: {
		title: 'Output'
	},
	value: function(){
		return this.inputs.in.getValue();
	}
}
OutputEffect.prototype.constructor = OutputEffect;
OutputEffect.prototype.__proto__ = Effect.prototype;

//output
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
	},
	value: function(){
		//return effect
	}
}
InputEffect.prototype.constructor = InputEffect;
InputEffect.prototype.__proto__ = Effect.prototype;