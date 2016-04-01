import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Sepiatone
export default class SepiatoneEffect extends MultiEffect{
	constructor(){
		super(...arguments);

		this.addInput('in',inputs.EffectInput);
		this.addOutput('result',outputs.EffectOutput);

		this.filter = {};
		this.filter.matrix = new SVG.ColorMatrixEffect('matrix', [
	        0.343, 0.669, 0.119, 0, 0,
	        0.249, 0.626, 0.130, 0, 0,
	        0.172, 0.334, 0.111, 0, 0,
	        0.000, 0.000, 0.000, 1, 0
	    ]);

	    this.render();
	    this.update();
	    this.updateElement();
	    this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Sepiatone'
	}
};
