import MultiEffect from '../multiEffect';
import * as inputs from '../inputs';
import * as outputs from '../outputs';

//GreyScale
export default class GreyScaleEffect extends MultiEffect{
	constructor(...args){
		super(...args);

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
