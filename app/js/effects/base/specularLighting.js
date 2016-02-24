import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//SpecularLighting
export default function SpecularLightingEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',inputs.EffectInput,{
		title: 'in'
	});
	this.addInput('color',inputs.ColorInput);
	this.addInput('surfaceScale',inputs.RangeInput,{
		min: -5,
		max: 5,
		step: 0.1,
		value: 1
	});
	this.addInput('specularConstant',inputs.NumberInput,{
		min: 1,
		max: 128,
		step: 1,
		value: 1
	});
	this.addInput('kernelUnitLength',inputs.XYInput,{
		min: 0,
		step: 0.1,
		value: 0
	});

	//light
	this.addInput('lightSource',inputs.SelectInput,{
		value: 'DistantLight',
		options: ['DistantLight', 'PointLight', 'SpotLight']
	});

	//DistantLight
	this.DistantLight = new SVG.DistantLight();
	this.addInput('azimuth',inputs.NumberInput,{
		min: 0,
		max: 360,
		step: 5,
		value: 0
	});
	this.addInput('elevation',inputs.NumberInput,{
		min: 0,
		max: 360,
		step: 5,
		value: 0
	});

	//PointLight
	this.PointLight = new SVG.PointLight();
	this.addInput('x',inputs.NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('y',inputs.NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('z',inputs.NumberInput,{
		step: 5,
		value: 0
	});

	//SpotLight
	this.SpotLight = new SVG.SpotLight();
	this.addInput('specularExponent',inputs.NumberInput,{
		step: 1,
		value: 1
	});
	this.addInput('limitingConeAngle',inputs.NumberInput,{
		step: 10,
		value: 0
	});
	this.addInput('pointsAtX',inputs.NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('pointsAtY',inputs.NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('pointsAtZ',inputs.NumberInput,{
		step: 5,
		value: 0
	});

	this.addOutput('result',outputs.EffectOutput);

	this.filter = new SVG.SpecularLightingEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
SpecularLightingEffect.prototype = {
	options: {
		title: 'SpecularLighting'
	},
	style: {
		width: '300px'
	},
	update: function(){
		//hide inputs
		this.inputs.azimuth.hide();
		this.inputs.elevation.hide();
		this.inputs.x.hide();
		this.inputs.y.hide();
		this.inputs.z.hide();
		this.inputs.pointsAtX.hide();
		this.inputs.pointsAtY.hide();
		this.inputs.pointsAtZ.hide();
		this.inputs.specularExponent.hide();
		this.inputs.limitingConeAngle.hide();

		//remove lights
		this.DistantLight.remove();
		this.PointLight.remove();
		this.SpotLight.remove();

		switch(this.inputs.lightSource.getValue()){
			case 'DistantLight':
				this.inputs.azimuth.show();
				this.inputs.elevation.show();
				this.filter.add(this.DistantLight);

				this.DistantLight.attr({
					azimuth: this.inputs.azimuth.getAttrValue(),
					elevation: this.inputs.elevation.getAttrValue()
				});
				break;
			case 'PointLight':
				this.inputs.x.show();
				this.inputs.y.show();
				this.inputs.z.show();
				this.filter.add(this.PointLight);

				this.PointLight.attr({
					x: this.inputs.x.getAttrValue(),
					y: this.inputs.y.getAttrValue(),
					z: this.inputs.z.getAttrValue()
				});
				break;
			case 'SpotLight':
				this.inputs.x.show();
				this.inputs.y.show();
				this.inputs.z.show();
				this.inputs.pointsAtX.show();
				this.inputs.pointsAtY.show();
				this.inputs.pointsAtZ.show();
				this.inputs.specularExponent.show();
				this.inputs.limitingConeAngle.show();
				this.filter.add(this.SpotLight);

				this.SpotLight.attr({
					x: this.inputs.x.getAttrValue(),
					y: this.inputs.y.getAttrValue(),
					z: this.inputs.z.getAttrValue(),
					pointsAtX: this.inputs.pointsAtX.getAttrValue(),
					pointsAtY: this.inputs.pointsAtY.getAttrValue(),
					pointsAtZ: this.inputs.pointsAtZ.getAttrValue(),
					specularExponent: this.inputs.specularExponent.getAttrValue(),
					limitingConeAngle: this.inputs.limitingConeAngle.getAttrValue()
				});
				break;
		}
		this.updateEndpoints();

		this.filter.attr({
			surfaceScale: this.inputs.surfaceScale.getAttrValue(),
			specularConstant: this.inputs.specularConstant.getAttrValue(),
			kernelUnitLength: this.inputs.kernelUnitLength.getAttrValue(),
			'lighting-color': this.inputs.color.getAttrValue(),
			in: this.inputs.in.getValue()
		});
	}
};
SpecularLightingEffect.prototype.constructor = SpecularLightingEffect;
SpecularLightingEffect.prototype.__proto__ = Effect.prototype;
