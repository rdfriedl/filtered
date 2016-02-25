import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Turbulence
export default class TurbulenceEffect extends Effect{
	constructor(){
		super();

		this.addInput('baseFrequency',inputs.XYInput,{
			min: 0,
			step: 0.01,
			value: 0
		});
		this.addInput('numOctaves',inputs.NumberInput,{
			min: 0,
			value: 1
		});
		this.addInput('seed',inputs.NumberInput,{
			min: 0,
			value: 0
		});
		this.addInput('stitchTiles',inputs.SelectInput,{
			value: 'noStitch',
			options: ['stitch','noStitch']
		});
		this.addInput('type',inputs.SelectInput,{
			value: 'turbulence',
			options: ['turbulence','fractalNoise']
		});

		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.TurbulenceEffect();

		this.render();
		this.update();
		this.updateEndpoints();
	    this.updatePostion();
	    this.updateElement();
	}
	options = {
		title: 'Turbulence'
	}
	update(){
		this.filter.attr({
			baseFrequency: this.inputs.baseFrequency.getAttrValue(),
			numOctaves: this.inputs.numOctaves.getAttrValue(),
			seed: this.inputs.seed.getAttrValue(),
			stitchTiles: this.inputs.stitchTiles.getValue(), //required
			type: this.inputs.type.getValue()
		});
	}
};
