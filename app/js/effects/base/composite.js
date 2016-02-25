import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//composite
export default class CompositeEffect extends Effect{
	constructor(){
	super();

		this.addInput('in',inputs.EffectInput,{
			title: "in 1"
		});
		this.addInput('in2',inputs.EffectInput,{
			title: "in 2"
		});
		this.addInput('operator',inputs.SelectInput,{
			value: 'over',
			options: ['over','in','out','atop','xor','arithmetic']
		});
		this.addInput('k1',inputs.NumberInput,{
			value: 0
		});
		this.addInput('k2',inputs.NumberInput,{
			value: 0
		});
		this.addInput('k3',inputs.NumberInput,{
			value: 0
		});
		this.addInput('k4',inputs.NumberInput,{
			value: 0
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.CompositeEffect();

		this.render();
		this.update();
		this.updateEndpoints();
	    this.updatePostion();
	    this.updateElment();
	}
	options = {
		title: 'Composite'
	}
	update(inputs){
		if(this.inputs.operator.getAttrValue() == 'arithmetic'){
			this.inputs.k1.show();
			this.inputs.k2.show();
			this.inputs.k3.show();
			this.inputs.k4.show();
			this.filter.attr({
				k1: this.inputs.k1.getAttrValue(),
				k2: this.inputs.k2.getAttrValue(),
				k3: this.inputs.k3.getAttrValue(),
				k4: this.inputs.k4.getAttrValue()
			});
			this.updateEndpoints();
		}
		else{
			this.inputs.k1.hide();
			this.inputs.k2.hide();
			this.inputs.k3.hide();
			this.inputs.k4.hide();
			this.filter.attr({
				k1: null,
				k2: null,
				k3: null,
				k4: null
			});
			this.updateEndpoints();
		}

		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			operator: this.inputs.operator.getValue()
		});
	}
};
