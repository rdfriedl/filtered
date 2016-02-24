import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//ColorMatrix
export default function ColorMatrixEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput);
	this.addInput('type',inputs.SelectInput,{
		value: 'matrix',
		options: ["matrix",'saturate','hueRotate','luminanceToAlpha']
	});
	this.addInput('matrix',inputs.MatrixInput,{
		width: 5,
		height: 4
	});
	this.addInput('saturate',inputs.NumberInput,{
		step: 0.1,
		value: 1
	});
	this.addInput('hueRotate',inputs.NumberInput,{
		min: 0,
		max: 360,
		step: 10,
		value: 0
	});

	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.ColorMatrixEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
ColorMatrixEffect.prototype = {
	options: {
		title: 'ColorMatrix'
	},
	update: function(inputs){
		this.inputs.matrix.hide();
		this.inputs.saturate.hide();
		this.inputs.hueRotate.hide();

		this.filter.attr('values',null);
		switch(this.inputs.type.getValue()){
			case 'matrix':
				this.inputs.matrix.show();
				this.filter.attr('values',this.inputs.matrix.getValue());
				break;
			case 'saturate':
				this.inputs.saturate.show();
				this.filter.attr('values',this.inputs.saturate.getValue());
				break;
			case 'hueRotate':
				this.inputs.hueRotate.show();
				this.filter.attr('values',this.inputs.hueRotate.getValue());
				break;
		}
		this.updateEndpoints();

		this.filter.attr({
			in: this.inputs.in.getValue(),
			type: this.inputs.type.getValue(),
		});
	},
	fromElement: function(el){
		Effect.prototype.fromElement.apply(this,arguments);

		var val = el.getAttribute('values');
		if(val === undefined || val === null) return;
		switch(this.inputs.type.getValue()){
			case 'matrix':
				this.inputs.matrix.fromAttr(val);
				break;
			case 'saturate':
				this.inputs.saturate.fromAttr(val);
				break;
			case 'hueRotate':
				this.inputs.hueRotate.fromAttr(val);
				break;
		}
		this.update();
	}
};
ColorMatrixEffect.prototype.constructor = ColorMatrixEffect;
ColorMatrixEffect.prototype.__proto__ = Effect.prototype;
