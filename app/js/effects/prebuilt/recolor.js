import MultiEffect from '../multiEffect.js';

//Recolor
export default function RecolorEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addInput('color',ColorInput);
	this.addInput('opacity',NumberInput,{
		min: 0,
		max: 1,
		step: 0.1,
		value: 1
	});
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.color = new SVG.FloodEffect();
	this.filter.composite = new SVG.CompositeEffect(this.filter.color,undefined,'in');

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
RecolorEffect.prototype = {
	options: {
		title: 'Recolor'
	},
	update: function(){
		this.filter.composite.in2(this.inputs.in.getValue());

		this.filter.color.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue()
		});
	}
};
RecolorEffect.prototype.constructor = RecolorEffect;
RecolorEffect.prototype.__proto__ = MultiEffect.prototype;
