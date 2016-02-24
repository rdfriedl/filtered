import MultiEffect from '../multiEffect.js';

//Stroke
export default function StrokeEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addInput('color',ColorInput);
	this.addInput('opacity',NumberInput,{
		min: 0,
		max: 1,
		step: 0.1,
		value: 1
	});
	this.addInput('size',NumberInput,{
		min: 0,
		value: 2
	});
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect(this.filter.color,undefined,'in');
	this.filter.stroke = new SVG.MorphologyEffect('dilate').in(this.filter.composite);
	this.filter.merge = new SVG.MergeEffect();

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
StrokeEffect.prototype = {
	options: {
		title: 'Stroke'
	},
	update: function(){
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
StrokeEffect.prototype.constructor = StrokeEffect;
StrokeEffect.prototype.__proto__ = MultiEffect.prototype;
