import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//GreyScale
export default class GreyScaleEffect extends MultiEffect{
	constructor(){
		super(...arguments);

		this.addInput('in',inputs.EffectInput);
		this.addOutput('result',outputs.EffectOutput);

		this.filter = {};
		this.filter.matrix = new SVG.ColorMatrixEffect('matrix', [
	        0.333, 0.333, 0.333, 0, 0,
	        0.333, 0.333, 0.333, 0, 0,
	        0.333, 0.333, 0.333, 0, 0,
	        0.000, 0.000, 0.000, 1, 0
	    ]);

	    this.render();
	    this.update();
	    this.updateElement();
	    this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'GreyScale'
	}
};
