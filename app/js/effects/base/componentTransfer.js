import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//ComponentTransfer
export default function ComponentTransferEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput);
	this.addInput('R',inputs.FuncRGBAInput,{
		chanel: "R"
	});
	this.addInput('G',inputs.FuncRGBAInput,{
		chanel: "G"
	});
	this.addInput('B',inputs.FuncRGBAInput,{
		chanel: "B"
	});
	this.addInput('A',inputs.FuncRGBAInput,{
		chanel: "A"
	});
	this.addOutput('result',putputs.EffectOutput);

	this.filter = new SVG.ComponentTransferEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
ComponentTransferEffect.prototype = {
	options: {
		title: 'ComponentTransfer'
	},
	style: {
		width: '300px'
	},
	update: function(inputs){
		this.filter.attr({
			in: this.inputs.in.getValue()
		});

		var _this = this;
		this.filter.each(function(){
			switch(this.type){
				case "feFuncR":
					this.attr(_this.inputs.R.getAttrValue());
					break;
				case "feFuncG":
					this.attr(_this.inputs.G.getAttrValue());
					break;
				case "feFuncB":
					this.attr(_this.inputs.B.getAttrValue());
					break;
				case "feFuncA":
					this.attr(_this.inputs.A.getAttrValue());
					break;
			}
		});
	}
};
ComponentTransferEffect.prototype.constructor = ComponentTransferEffect;
ComponentTransferEffect.prototype.__proto__ = Effect.prototype;
