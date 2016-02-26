import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Bump
export default class BumpEffect extends MultiEffect{
	constructor(){
		super(...arguments);

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
	    this.updateElement();
	    this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Bump'
	}
	update(){
		var v = this.inputs.amount.getValue();
		this.filter.matrix.attr({
            in: this.inputs.in.getValue(),
			order: 3,
			kernelMatrix: v+' 0 0 0 1 0 0 0 -'+v
		});
	}
};
