import MultiEffect from '../multiEffect.js';

//GreyScale
export default function GreyScaleEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.matrix = new SVG.ColorMatrixEffect('matrix', [
        0.333, 0.333, 0.333, 0, 0,
        0.333, 0.333, 0.333, 0, 0,
        0.333, 0.333, 0.333, 0, 0,
        0.000, 0.000, 0.000, 1, 0
    ]);

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
GreyScaleEffect.prototype = {
	options: {
		title: 'GreyScale'
	},
	update: function(){

	}
};
GreyScaleEffect.prototype.constructor = GreyScaleEffect;
GreyScaleEffect.prototype.__proto__ = MultiEffect.prototype;
