import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Morphology
export default class MorphologyEffect extends Effect{
	constructor(){
		super();

		this.addInput('in',inputs.EffectInput,{
			title: "in"
		});
		this.addInput('operator',inputs.SelectInput,{
			value: 'erode',
			options: [
				{
					title: 'out',
					value: 'dilate'
				},
				{
					title: 'in',
					value: 'erode'
				}
			]
		});
		this.addInput('radius',inputs.XYInput,{
			min: 0,
			value: 0
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.MorphologyEffect();

		this.render();
		this.update();
		this.updateEndpoints();
	    this.updatePostion();
	    this.updateElement();
	}
	options = {
		title: 'Morphology'
	}
	update(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			operator: this.inputs.operator.getValue(),
			radius: this.inputs.radius.getValue()
		});
	}
};
