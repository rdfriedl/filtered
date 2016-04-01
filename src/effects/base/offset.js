import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//offset
export default class OffsetEffect extends Effect{
	constructor(){
        super(...arguments);

		this.addInput('in',inputs.EffectInput,{
			title: "in"
		});
		this.addInput('x',inputs.NumberInput,{
			value: 0
		});
		this.addInput('y',inputs.NumberInput,{
			value: 0
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.OffsetEffect();

		this.render();
		this.update();
	    this.updateElement();
		this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Offset'
	}
	update(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			dx: this.inputs.x.getAttrValue(),
			dy: this.inputs.y.getAttrValue(),
		});
	}
};
