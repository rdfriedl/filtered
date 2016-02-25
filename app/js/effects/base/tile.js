import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Tile
export default class TileEffect extends Effect{
	constructor(){
		super();

		this.addInput('in',inputs.EffectInput,{
			title: "in"
		});

		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.TileEffect();

		this.render();
		this.update();
		this.updateEndpoints();
	    this.updatePostion();
	    this.updateElement();
	}
	options = {
		title: 'Tile'
	}
	update(){
		this.filter.attr({
			in: this.inputs.in.getValue()
		});
	}
};
