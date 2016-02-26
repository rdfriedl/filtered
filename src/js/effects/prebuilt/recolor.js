import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Recolor
export default class RecolorEffect extends MultiEffect{
	constructor(){
		super(...arguments);

		this.addInput('in',inputs.EffectInput);
		this.addInput('color',inputs.ColorInput);
		this.addInput('opacity',inputs.NumberInput,{
			min: 0,
			max: 1,
			step: 0.1,
			value: 1
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = {};
		this.filter.color = new SVG.FloodEffect();
		this.filter.composite = new SVG.CompositeEffect(this.filter.color,undefined,'in');

	    this.render();
	    this.update();
	    this.updateElement();
	    this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Recolor'
	}
	update(){
		this.filter.composite.in2(this.inputs.in.getValue());

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		});
	}
};
