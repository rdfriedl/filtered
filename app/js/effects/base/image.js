import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Image
export default function ImageEffect(){
	Effect.apply(this,arguments);

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
}
ImageEffect.prototype = {
	options: {
		title: 'Image'
	},
	update: function(){
		this.filter.attr({
			'xlink:href': this.inputs.image.getAttrValue(),
			preserveAspectRatio: this.inputs.preserveAspectRatio.getValue(),
		});
	}
};
ImageEffect.prototype.constructor = ImageEffect;
ImageEffect.prototype.__proto__ = Effect.prototype;
