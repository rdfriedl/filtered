import Effect from './effect.js';
import * as inputs from './inputs.js';
import * as outputs from './outputs.js';

//output
export default class OutputEffect extends Effect{
	constructor(){
        super(...arguments);

		this.addInput('in',inputs.EffectInput,{
			title: "out"
		});

		this.filter = new SVG.OffsetEffect();

		this.render();
		this.update();
	    this.updateElement();
		this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Output'
	}
	menu = []
	toggleButton = false
	update(){
		this.filter.attr({
			in: previewFilter || this.inputs.in.getValue() || 'SourceGraphic',
			result: 'output'
		});

		this.arange();
	}
}
