import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Tile
export default function TileEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput,{
		title: "in"
	});

	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.TileEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
TileEffect.prototype = {
	options: {
		title: 'Tile'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue()
		});
	}
};
TileEffect.prototype.constructor = TileEffect;
TileEffect.prototype.__proto__ = Effect.prototype;
