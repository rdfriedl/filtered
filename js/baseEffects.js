"use strict";

//blend
function BlendEffect(){
	Effect.apply(this,arguments);

	this.addInput('mode',SelectInput,{
		value: 'normal',
		options: ['normal','multiply','screen','darken','lighten']
	});
	this.addInput('in',EffectInput,{
		title: "in 1"
	});
	this.addInput('in2',EffectInput,{
		title: "in 2"
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.BlendEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
BlendEffect.prototype = {
	options: {
		title: 'Blend'
	},
	update: function(inputs){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			mode: this.inputs.mode.getValue()
		});
	}
};
BlendEffect.prototype.constructor = BlendEffect;
BlendEffect.prototype.__proto__ = Effect.prototype;

//ColorMatrix
function ColorMatrixEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addInput('type',SelectInput,{
		value: 'matrix',
		options: ["matrix",'saturate','hueRotate','luminanceToAlpha']
	});
	this.addInput('matrix',MatrixInput,{
		width: 5,
		height: 4
	});
	this.addInput('saturate',NumberInput,{
		step: 0.1,
		value: 1
	});
	this.addInput('hueRotate',NumberInput,{
		min: 0,
		max: 360,
		step: 10,
		value: 0
	});

	this.addOutput('result',EffectOutput);

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

//ComponentTransfer
function ComponentTransferEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addInput('R',FuncRGBAInput,{
		chanel: "R"
	});
	this.addInput('G',FuncRGBAInput,{
		chanel: "G"
	});
	this.addInput('B',FuncRGBAInput,{
		chanel: "B"
	});
	this.addInput('A',FuncRGBAInput,{
		chanel: "A"
	});
	this.addOutput('result',EffectOutput);

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

//composite
function CompositeEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "in 1"
	});
	this.addInput('in2',EffectInput,{
		title: "in 2"
	});
	this.addInput('operator',SelectInput,{
		value: 'over',
		options: ['over','in','out','atop','xor','arithmetic']
	});
	this.addInput('k1',NumberInput,{
		value: 0
	});
	this.addInput('k2',NumberInput,{
		value: 0
	});
	this.addInput('k3',NumberInput,{
		value: 0
	});
	this.addInput('k4',NumberInput,{
		value: 0
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.CompositeEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
CompositeEffect.prototype = {
	options: {
		title: 'Composite'
	},
	update: function(inputs){
		if(this.inputs.operator.getAttrValue() == 'arithmetic'){
			this.inputs.k1.show();
			this.inputs.k2.show();
			this.inputs.k3.show();
			this.inputs.k4.show();
			this.filter.attr({
				k1: this.inputs.k1.getAttrValue(),
				k2: this.inputs.k2.getAttrValue(),
				k3: this.inputs.k3.getAttrValue(),
				k4: this.inputs.k4.getAttrValue()
			});
			this.updateEndpoints();
		}
		else{
			this.inputs.k1.hide();
			this.inputs.k2.hide();
			this.inputs.k3.hide();
			this.inputs.k4.hide();
			this.filter.attr({
				k1: null,
				k2: null,
				k3: null,
				k4: null
			});
			this.updateEndpoints();
		}

		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			operator: this.inputs.operator.getValue()
		});
	}
};
CompositeEffect.prototype.constructor = CompositeEffect;
CompositeEffect.prototype.__proto__ = Effect.prototype;

//ConvolveMatrix
function ConvolveMatrixEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput);
	this.addInput('order',XYInput,{
		min: 1,
		value: 3
	});
	this.addInput('matrix',MatrixInput,{
		width: 3,
		height: 3
	});
	this.addInput('target',XYInput,{
		value: 0
	});
	this.addInput('divisor',NumberInput,{
		min: 0,
		value: 1
	});
	this.addInput('bias',NumberInput,{
		min: 0,
		value: 0,
		step: 0.01
	});
	this.addInput('kernelUnitLength',XYInput,{
		min: 1,
		value: 1
	});
	this.addInput('edgeMode',SelectInput,{
		value: 'duplicate',
		options: ['duplicate','wrap','none']
	});
	this.addInput('preserveAlpha',SelectInput,{
		value: 'false',
		options: ['false','true']
	});

	this.addOutput('result',EffectOutput);

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

//DiffuseLighting
function DiffuseLightingEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: 'in'
	});
	this.addInput('color',ColorInput);
	this.addInput('surfaceScale',RangeInput,{
		min: -5,
		max: 5,
		step: 0.1,
		value: 1
	});
	this.addInput('specularConstant',NumberInput,{
		min: 1,
		max: 128,
		step: 1,
		value: 1
	});
	this.addInput('kernelUnitLength',XYInput,{
		min: 0,
		step: 0.1,
		value: 0
	});

	//light
	this.addInput('lightSource',SelectInput,{
		value: 'DistantLight',
		options: ['DistantLight', 'PointLight', 'SpotLight']
	});

	//DistantLight
	this.DistantLight = new SVG.DistantLight();
	this.addInput('azimuth',NumberInput,{
		min: 0,
		max: 360,
		step: 5,
		value: 0
	});
	this.addInput('elevation',NumberInput,{
		min: 0,
		max: 360,
		step: 5,
		value: 0
	});

	//PointLight
	this.PointLight = new SVG.PointLight();
	this.addInput('x',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('y',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('z',NumberInput,{
		step: 5,
		value: 0
	});

	//SpotLight
	this.SpotLight = new SVG.SpotLight();
	this.addInput('specularExponent',NumberInput,{
		step: 1,
		value: 1
	});
	this.addInput('limitingConeAngle',NumberInput,{
		step: 10,
		value: 0
	});
	this.addInput('pointsAtX',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('pointsAtY',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('pointsAtZ',NumberInput,{
		step: 5,
		value: 0
	});

	this.addOutput('result',EffectOutput);

	this.filter = new SVG.DiffuseLightingEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
DiffuseLightingEffect.prototype = {
	options: {
		title: 'DiffuseLighting'
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
DiffuseLightingEffect.prototype.constructor = DiffuseLightingEffect;
DiffuseLightingEffect.prototype.__proto__ = Effect.prototype;

//DisplacementMap
function DisplacementMapEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "in"
	});
	this.addInput('in2',EffectInput,{
		title: "in 2"
	});
	this.addInput('scale',NumberInput,{
		min: 0,
		step: 1,
		value: 0
	});
	this.addInput('xChannelSelector',SelectInput,{
		value: 'A',
		options: ['R','G','B','A']
	});
	this.addInput('yChannelSelector',SelectInput,{
		value: 'A',
		options: ['R','G','B','A']
	});

	this.addOutput('result',EffectOutput);

	this.filter = new SVG.DisplacementMapEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
DisplacementMapEffect.prototype = {
	options: {
		title: 'DisplacementMap'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			scale: this.inputs.scale.getAttrValue(),
			xChannelSelector: this.inputs.xChannelSelector.getAttrValue(),
			yChannelSelector: this.inputs.yChannelSelector.getAttrValue()
		});
	}
};
DisplacementMapEffect.prototype.constructor = DisplacementMapEffect;
DisplacementMapEffect.prototype.__proto__ = Effect.prototype;

//Flood
function FloodEffect(){
	Effect.apply(this,arguments);

	this.addInput('color',ColorInput);
	this.addInput('opacity',NumberInput,{
		min: 0,
		max: 1,
		step: 0.1,
		value: 1
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.FloodEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
FloodEffect.prototype = {
	options: {
		title: 'Flood'
	},
	update: function(){
		this.filter.attr({
			'flood-color': this.inputs.color.getAttrValue(),
			'flood-opacity': this.inputs.opacity.getAttrValue(),
		});
	}
};
FloodEffect.prototype.constructor = FloodEffect;
FloodEffect.prototype.__proto__ = Effect.prototype;

//GaussianBlur
function GaussianBlurEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "in"
	});
	this.addInput('blur',XYInput,{
		min: 0,
		value: 0
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.GaussianBlurEffect(0);

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
GaussianBlurEffect.prototype = {
	options: {
		title: 'Blur'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			'stdDeviation': this.inputs.blur.getValue()
		});
	}
};
GaussianBlurEffect.prototype.constructor = GaussianBlurEffect;
GaussianBlurEffect.prototype.__proto__ = Effect.prototype;

//Image
function ImageEffect(){
	Effect.apply(this,arguments);

	this.addInput('image',ImageInput);
	this.addInput('preserveAspectRatio',MutiSelectInput,{
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
	this.addOutput('result',EffectOutput);

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

//Merge
function MergeEffect(){
	Effect.apply(this,arguments);

	this.addInput('in 1',EffectInput,{
		title: "in 1"
	});
	this.addInput('in 2',EffectInput,{
		title: "in 2"
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.MergeEffect();

	this.menu = [
		{
			type: 'item',
			icon: 'plus',
			title: 'Add Input',
			action: function(){
				var a = Object.keys(this.inputs);
				this.addInput('in'+(a.length+1),EffectInput,{
					title: 'in '+(a.length+1)
				});
				this.render();
				this.updateEndpoints();
			}
		},
		{
			type: 'item',
			icon: 'minus',
			title: 'Remove Input',
			action: function(){
				var a = Object.keys(this.inputs);
				if(a.length > 0){
					this.removeInput(a[a.length-1]);
					this.render();
					this.updateEndpoints();
				}
			}
		},
		{
			type: 'separator'
		}
	].concat(this.menu);
	this.updateMenu();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
MergeEffect.prototype = {
	options: {
		title: 'Merge'
	},
	fromJSON: function(data,dontUpdate){
		data = data || {};

		if(data.inputs){
			for(var k in data.inputs){
				if(!this.inputs[k]){
					this.addInput(k,EffectInput,{
						title: k
					});
				}
				this.inputs[k].fromJSON(data.inputs[k]);
			}
		}

		if(data.style){
			this.style.top = data.style.top;
			this.style.left = data.style.left;
			this.applyStyles();
			this.updateEndpoints();
		}

		if(data.position){
			this.position.x = data.position.x !== undefined? data.position.x : this.position.x;
			this.position.y = data.position.y !== undefined? data.position.y : this.position.y;
			this.position.width = data.position.width !== undefined? data.position.width : this.position.width;
			this.position.height = data.position.height !== undefined? data.position.height : this.position.height;
			this.updatePostion();
		}

		if(!dontUpdate){
			this.render();
			this.updateEndpoints();
			this.update();
		}
	},
	update: function(){
		this.filter.clear();
		for(var i in this.inputs){
			if(this.inputs[i].getAttrValue()) this.filter.add(new SVG.MergeNode(this.inputs[i].getAttrValue()));
		}
	}
};
MergeEffect.prototype.constructor = MergeEffect;
MergeEffect.prototype.__proto__ = Effect.prototype;

//Morphology
function MorphologyEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "in"
	});
	this.addInput('operator',SelectInput,{
		value: 'erode',
		options: [
			{
				title: 'out',
				value: 'dilate'
			},
			{
				title: 'in',
				value: 'erode'
			}
		]
	});
	this.addInput('radius',XYInput,{
		min: 0,
		value: 0
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.MorphologyEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
MorphologyEffect.prototype = {
	options: {
		title: 'Morphology'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			operator: this.inputs.operator.getValue(),
			radius: this.inputs.radius.getValue()
		});
	}
};
MorphologyEffect.prototype.constructor = MorphologyEffect;
MorphologyEffect.prototype.__proto__ = Effect.prototype;

//offset
function OffsetEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "in"
	});
	this.addInput('x',NumberInput,{
		value: 0
	});
	this.addInput('y',NumberInput,{
		value: 0
	});
	this.addOutput('result',EffectOutput);

	this.filter = new SVG.OffsetEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
OffsetEffect.prototype = {
	options: {
		title: 'Offset'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			dx: this.inputs.x.getAttrValue(),
			dy: this.inputs.y.getAttrValue(),
		});
	}
};
OffsetEffect.prototype.constructor = OffsetEffect;
OffsetEffect.prototype.__proto__ = Effect.prototype;

//SpecularLighting
function SpecularLightingEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: 'in'
	});
	this.addInput('color',ColorInput);
	this.addInput('surfaceScale',RangeInput,{
		min: -5,
		max: 5,
		step: 0.1,
		value: 1
	});
	this.addInput('specularConstant',NumberInput,{
		min: 1,
		max: 128,
		step: 1,
		value: 1
	});
	this.addInput('kernelUnitLength',XYInput,{
		min: 0,
		step: 0.1,
		value: 0
	});

	//light
	this.addInput('lightSource',SelectInput,{
		value: 'DistantLight',
		options: ['DistantLight', 'PointLight', 'SpotLight']
	});

	//DistantLight
	this.DistantLight = new SVG.DistantLight();
	this.addInput('azimuth',NumberInput,{
		min: 0,
		max: 360,
		step: 5,
		value: 0
	});
	this.addInput('elevation',NumberInput,{
		min: 0,
		max: 360,
		step: 5,
		value: 0
	});

	//PointLight
	this.PointLight = new SVG.PointLight();
	this.addInput('x',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('y',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('z',NumberInput,{
		step: 5,
		value: 0
	});

	//SpotLight
	this.SpotLight = new SVG.SpotLight();
	this.addInput('specularExponent',NumberInput,{
		step: 1,
		value: 1
	});
	this.addInput('limitingConeAngle',NumberInput,{
		step: 10,
		value: 0
	});
	this.addInput('pointsAtX',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('pointsAtY',NumberInput,{
		step: 5,
		value: 0
	});
	this.addInput('pointsAtZ',NumberInput,{
		step: 5,
		value: 0
	});

	this.addOutput('result',EffectOutput);

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

//Tile
function TileEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "in"
	});

	this.addOutput('result',EffectOutput);

	this.filter = new SVG.TileEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
TileEffect.prototype = {
	options: {
		title: 'Tile'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue()
		});
	}
};
TileEffect.prototype.constructor = TileEffect;
TileEffect.prototype.__proto__ = Effect.prototype;

//Turbulence
function TurbulenceEffect(){
	Effect.apply(this,arguments);

	this.addInput('baseFrequency',XYInput,{
		min: 0,
		step: 0.01,
		value: 0
	});
	this.addInput('numOctaves',NumberInput,{
		min: 0,
		value: 1
	});
	this.addInput('seed',NumberInput,{
		min: 0,
		value: 0
	});
	this.addInput('stitchTiles',SelectInput,{
		value: 'noStitch',
		options: ['stitch','noStitch']
	});
	this.addInput('type',SelectInput,{
		value: 'turbulence',
		options: ['turbulence','fractalNoise']
	});

	this.addOutput('result',EffectOutput);

	this.filter = new SVG.TurbulenceEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
TurbulenceEffect.prototype = {
	options: {
		title: 'Turbulence'
	},
	update: function(){
		this.filter.attr({
			baseFrequency: this.inputs.baseFrequency.getAttrValue(),
			numOctaves: this.inputs.numOctaves.getAttrValue(),
			seed: this.inputs.seed.getAttrValue(),
			stitchTiles: this.inputs.stitchTiles.getValue(), //required
			type: this.inputs.type.getValue()
		});
	}
};
TurbulenceEffect.prototype.constructor = TurbulenceEffect;
TurbulenceEffect.prototype.__proto__ = Effect.prototype;

// ------------------------- input & outputs ---------------------------

//inputs
function InputEffect(){
	Effect.apply(this,arguments);

	this.addOutput('BackgroundImage',EffectOutput,{
		title: 'BackgroundImage'
	},{
		value: 'BackgroundImage'
	});
	this.addOutput('BackgroundAlpha',EffectOutput,{
		title: 'BackgroundAlpha'
	},{
		value: 'BackgroundAlpha'
	});
	this.addOutput('FillPaint',EffectOutput,{
		title: 'FillPaint'
	},{
		value: 'FillPaint'
	});
	this.addOutput('StrokePaint',EffectOutput,{
		title: 'StrokePaint'
	},{
		value: 'StrokePaint'
	});
	this.addOutput('SourceAlpha',EffectOutput,{
		title: "SourceAlpha"
	},{
		value: 'SourceAlpha'
	});
	this.addOutput('SourceGraphic',EffectOutput,{
		title: "SourceGraphic"
	},{
		value: 'SourceGraphic'
	});

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
InputEffect.prototype = {
	options: {
		title: 'Input'
	},
	menu: [
		{
			type: 'item',
			icon: 'object-ungroup',
			title: 'Position',
			action: function(){
				this.editPosition();
			}
		},
        {
            type: 'item',
            icon: 'question',
            title: 'Help',
            action: function(){
                $('#help').modal('show');
                $('#help iframe').attr('src','help/index.html#FilterElement');
            }
		}
	],
	toggleButton: false,
	updatePostion: function(){ //use filter and not this.filter
        if(this.position.hasOwnProperty('x')){ filter.x(this.position.x + '%') } else { filter.attr('x',null) }
        if(this.position.hasOwnProperty('y')){ filter.y(this.position.y + '%') } else { filter.attr('y',null) }
        if(this.position.hasOwnProperty('width')){ filter.width(this.position.width + '%') } else { filter.attr('width',null) }
        if(this.position.hasOwnProperty('height')){ filter.height(this.position.height + '%') } else { filter.attr('height',null) }
	}
};
InputEffect.prototype.constructor = InputEffect;
InputEffect.prototype.__proto__ = Effect.prototype;

//output
function OutputEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',EffectInput,{
		title: "out"
	});

	this.filter = new SVG.OffsetEffect();

	this.render();
	this.update();
	this.updateEndpoints();
    this.updatePostion();
}
OutputEffect.prototype = {
	options: {
		title: 'Output'
	},
	menu: [],
	toggleButton: false,
	update: function(){
		this.filter.attr({
			in: previewFilter || this.inputs.in.getValue() || 'SourceGraphic',
			result: 'output'
		});

		this.arange();
	}
};
OutputEffect.prototype.constructor = OutputEffect;
OutputEffect.prototype.__proto__ = Effect.prototype;
