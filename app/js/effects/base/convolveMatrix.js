import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//ConvolveMatrix
export default function ConvolveMatrixEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput);
	this.addInput('order',inputs.XYInput,{
		min: 1,
		value: 3
	});
	this.addInput('matrix',inputs.MatrixInput,{
		width: 3,
		height: 3
	});
	this.addInput('target',inputs.XYInput,{
		value: 0
	});
	this.addInput('divisor',inputs.NumberInput,{
		min: 0,
		value: 1
	});
	this.addInput('bias',inputs.NumberInput,{
		min: 0,
		value: 0,
		step: 0.01
	});
	this.addInput('kernelUnitLength',inputs.XYInput,{
		min: 1,
		value: 1
	});
	this.addInput('edgeMode',inputs.SelectInput,{
		value: 'duplicate',
		options: ['duplicate','wrap','none']
	});
	this.addInput('preserveAlpha',inputs.SelectInput,{
		value: 'false',
		options: ['false','true']
	});

	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.ConvolveMatrixEffect('');

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
ConvolveMatrixEffect.prototype = {
	style: {
		width: '300px'
	},
	options: {
		title: 'ConvolveMatrix'
	},
	update: function(inputs){
		if(this.inputs.order.getX() !== this.inputs.matrix.getSize().width || this.inputs.order.getY() !== this.inputs.matrix.getSize().height){
			this.inputs.matrix.setSize(this.inputs.order.getX(),this.inputs.order.getY());
			this.updateEndpoints();
		}

		this.filter.attr({
			in: this.inputs.in.getValue(),
			order: this.inputs.order.getAttrValue(),
			kernelMatrix: this.inputs.matrix.getAttrValue(),
			kernelUnitLength: this.inputs.kernelUnitLength.getAttrValue(),
			divisor: this.inputs.divisor.getAttrValue(),
			targetX: this.inputs.target.getX(),
			targetY: this.inputs.target.getY(),
			bias: this.inputs.bias.getAttrValue(),
			edgeMode: this.inputs.edgeMode.getAttrValue(),
			preserveAlpha: this.inputs.preserveAlpha.getValue()
		});
	}
};
ConvolveMatrixEffect.prototype.constructor = ConvolveMatrixEffect;
ConvolveMatrixEffect.prototype.__proto__ = Effect.prototype;