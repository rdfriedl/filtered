import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Bump
export default function BumpEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput);
	this.addInput('amount',inputs.NumberInput,{
		min: 0,
		step: 1
	});
	this.addOutput('result',outputs.EffectOutput);

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
		});
	}
};
BumpEffect.prototype.constructor = BumpEffect;
BumpEffect.prototype.__proto__ = MultiEffect.prototype;
