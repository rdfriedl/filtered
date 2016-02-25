import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Image
export default class ImageEffect extends Effect{
	constructor(){
		super();

		this.addInput('image',inputs.ImageInput);
		this.addInput('preserveAspectRatio',inputs.MutiSelectInput,{
			options: [
				{
					options: [{title: 'none', value: ''},'defer'],
					value: ''
				},
				{
					options: ['none','xMinYMin','xMidYMin','xMaxYMin','xMinYMid','xMidYMid','xMaxYMid','xMinYMax','xMidYMax','xMaxYMax'],
					value: 'xMidYMid'
				},
				{
					options: ['meet','slice'],
					value: 'meet',
					disabled: ['none']
				}
			]
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.ImageEffect();

		this.render();
		this.update();
		this.updateEndpoints();
	    this.updatePostion();
	    this.updateElement();
	}
	options = {
		title: 'Image'
	}
	update(){
		this.filter.attr({
			'xlink:href': this.inputs.image.getAttrValue(),
			preserveAspectRatio: this.inputs.preserveAspectRatio.getValue(),
		});
	}
};
