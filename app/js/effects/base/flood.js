import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Flood
export default function FloodEffect(){
	Effect.apply(this,arguments);

	this.addInput('color',inputs.ColorInput);
	this.addInput('opacity',inputs.NumberInput,{
		min: 0,
		max: 1,
		step: 0.1,
		value: 1
	});
	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.FloodEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
FloodEffect.prototype = {
	options: {
		title: 'Flood'
	},
	update: function(){
		this.filter.attr({
			'flood-color': this.inputs.color.getAttrValue(),
			'flood-opacity': this.inputs.opacity.getAttrValue(),
		});
	}
};
FloodEffect.prototype.constructor = FloodEffect;
FloodEffect.prototype.__proto__ = Effect.prototype;
