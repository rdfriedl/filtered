import Effect from './effect';
import * as inputs from './inputs';
import * as outputs from './outputs';

//output
export default class OutputEffect extends Effect{
	constructor(){
        super();

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
			// in: previewFilter || this.inputs.in.getValue() || 'SourceGraphic',
			result: 'output'
		});

		this.arange();
	}
}
