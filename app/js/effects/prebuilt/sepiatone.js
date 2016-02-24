import MultiEffect from '../multiEffect.js';

//Sepiatone
export default function SepiatoneEffect(){
	MultiEffect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addOutput('result',EffectOutput);

	this.filter = {};
	this.filter.matrix = new SVG.ColorMatrixEffect('matrix', [
        0.343, 0.669, 0.119, 0, 0,
        0.249, 0.626, 0.130, 0, 0,
        0.172, 0.334, 0.111, 0, 0,
        0.000, 0.000, 0.000, 1, 0
    ]);

    this.render();
    this.update();
    this.updateEndpoints();
    this.updatePostion();
}
SepiatoneEffect.prototype = {
	options: {
		title: 'Sepiatone'
	},
	update: function(){

	}
};
SepiatoneEffect.prototype.constructor = SepiatoneEffect;
SepiatoneEffect.prototype.__proto__ = MultiEffect.prototype;
