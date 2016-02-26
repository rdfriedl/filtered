import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//GaussianBlur
export default class GaussianBlurEffect extends Effect{
	constructor(){
        super(...arguments);

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
	    this.updateElement();
		this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Blur'
	}
	update(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			'stdDeviation': this.inputs.blur.getValue()
		});
	}
};
