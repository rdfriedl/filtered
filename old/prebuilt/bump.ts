import MultiEffect from '../multiEffect';
import * as inputs from '../inputs';
import * as outputs from '../outputs';

//Bump
export default class BumpEffect extends MultiEffect{
	constructor(..args){
		super(...args);

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
