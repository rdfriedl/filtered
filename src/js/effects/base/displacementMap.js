import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//DisplacementMap
export default class DisplacementMapEffect extends Effect{
	constructor(){
        super(...arguments);

		this.addInput('in',inputs.EffectInput,{
			title: "in"
		});
		this.addInput('in2',inputs.EffectInput,{
			title: "in 2"
		});
		this.addInput('scale',inputs.NumberInput,{
			min: 0,
			step: 1,
			value: 0
		});
		this.addInput('xChannelSelector',inputs.SelectInput,{
			value: 'A',
			options: ['R','G','B','A']
		});
		this.addInput('yChannelSelector',inputs.SelectInput,{
			value: 'A',
			options: ['R','G','B','A']
		});

		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.DisplacementMapEffect();

		this.render();
		this.update();
	    this.updateElement();
		this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'DisplacementMap'
	}
	update(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			scale: this.inputs.scale.getAttrValue(),
			xChannelSelector: this.inputs.xChannelSelector.getAttrValue(),
			yChannelSelector: this.inputs.yChannelSelector.getAttrValue()
		});
	}
};
