import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//GaussianBlur
export default function GaussianBlurEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput,{
		title: "in"
	});
	this.addInput('blur',inputs.XYInput,{
		min: 0,
		value: 0
	});
	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.GaussianBlurEffect(0);

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
GaussianBlurEffect.prototype = {
	options: {
		title: 'Blur'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			'stdDeviation': this.inputs.blur.getValue()
		});
	}
};
GaussianBlurEffect.prototype.constructor = GaussianBlurEffect;
GaussianBlurEffect.prototype.__proto__ = Effect.prototype;
