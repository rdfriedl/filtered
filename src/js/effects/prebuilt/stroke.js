import MultiEffect from '../multiEffect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Stroke
export default class StrokeEffect extends MultiEffect{
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
		this.addInput('size',inputs.NumberInput,{
			min: 0,
			value: 2
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = {};
		this.filter.color = new SVG.FloodEffect();
		this.filter.composite = new SVG.CompositeEffect(this.filter.color,undefined,'in');
		this.filter.stroke = new SVG.MorphologyEffect('dilate').in(this.filter.composite);
		this.filter.merge = new SVG.MergeEffect();

	    this.render();
	    this.update();
	    this.updateElement();
	    this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Stroke'
	}
	update(){
		this.filter.composite.in2(this.inputs.in.getValue());

		this.filter.merge.clear();
		this.filter.merge.add(new SVG.MergeNode(this.filter.stroke));
		this.filter.merge.add(new SVG.MergeNode(this.inputs.in.getValue()));

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		});
		this.filter.stroke.attr({
			radius: this.inputs.size.getValue()
		});
	}
};
