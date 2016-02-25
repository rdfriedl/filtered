import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Shadow
export default function ShadowEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput);
	this.addInput('color',inputs.ColorInput);
	this.addInput('opacity',inputs.NumberInput,{
		min: 0,
		max: 1,
		step: 0.1,
		value: 1
	});
	this.addInput('offsetX',inputs.NumberInput,{
		value: 8
	});
	this.addInput('offsetY',inputs.NumberInput,{
		value: 8
	});
	this.addInput('blur',inputs.NumberInput,{
		min: 0,
		value: 3
	});
	this.addOutput('result',outputs.EffectOutput);

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect(this.filter.color,"SourceAlpha",'in');
	this.filter.offset = new SVG.OffsetEffect().in(this.filter.composite);
	this.filter.blur = new SVG.GaussianBlurEffect(0).in(this.filter.offset);
	this.filter.merge = new SVG.MergeEffect(this.filter.blur,"SourceGraphic");

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
		this.filter.composite.in2(this.inputs.in.getValue());

		this.filter.merge.clear();
		this.filter.merge.add(new SVG.MergeNode(this.filter.blur));
		this.filter.merge.add(new SVG.MergeNode(this.inputs.in.getValue()));

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		});
		this.filter.offset.attr({
			dx: this.inputs.offsetX.getValue(),
			dy: this.inputs.offsetY.getValue()
		});
		this.filter.blur.attr({
			stdDeviation: this.inputs.blur.getValue(),
		});
	}
};
ShadowEffect.prototype.constructor = ShadowEffect;
ShadowEffect.prototype.__proto__ = MultiEffect.prototype;
