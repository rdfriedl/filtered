import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//blend
export default function BlendEffect(){
	Effect.apply(this,arguments);

	this.addInput('mode',inputs.SelectInput,{
		value: 'normal',
		options: ['normal','multiply','screen','darken','lighten']
	});
	this.addInput('in',inputs.EffectInput,{
		title: "in 1"
	});
	this.addInput('in2',inputs.EffectInput,{
		title: "in 2"
	});
	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.BlendEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
BlendEffect.prototype = {
	options: {
		title: 'Blend'
	},
	update: function(inputs){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			mode: this.inputs.mode.getValue()
		});
	}
};
BlendEffect.prototype.constructor = BlendEffect;
BlendEffect.prototype.__proto__ = Effect.prototype;
