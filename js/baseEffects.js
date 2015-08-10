//flood
function FloodEffect(){
	Effect.apply(this,arguments);

	this.addInput('color',new ColorInput(this));
	this.addInput('opacity',new NumberInput(this,{
		min: 0,
		max: 1,
		step: .1,
		value: 1
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.FloodEffect();
	this.update();
}
FloodEffect.prototype = {
	options: {
		title: 'Flood'
	},
	update: function(){
		this.filter.attr({
			'flood-color': this.inputs.color.getValue(),
			'flood-opacity': this.inputs.opacity.getValue(),
		});
	}
}
FloodEffect.prototype.constructor = FloodEffect;
FloodEffect.prototype.__proto__ = Effect.prototype;

//offset
function OffsetEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addInput('x',new NumberInput(this));
	this.addInput('y',new NumberInput(this));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.OffsetEffect();
	this.update();
}
OffsetEffect.prototype = {
	options: {
		title: 'Offset'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			dx: this.inputs.x.getValue(),
			dy: this.inputs.y.getValue(),
		})
	}
}
OffsetEffect.prototype.constructor = OffsetEffect;
OffsetEffect.prototype.__proto__ = Effect.prototype;

//Tile
function TileEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.TileEffect();
	this.update();
}
TileEffect.prototype = {
	options: {
		title: 'Tile'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue()
		})
	}
}
TileEffect.prototype.constructor = TileEffect;
TileEffect.prototype.__proto__ = Effect.prototype;

//GaussianBlur
function GaussianBlurEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addInput('blur',new XYInput(this,{
		min: 0,
		value: 0
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.GaussianBlurEffect(0);
	this.update();
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
}
GaussianBlurEffect.prototype.constructor = GaussianBlurEffect;
GaussianBlurEffect.prototype.__proto__ = Effect.prototype;

//Morphology
function MorphologyEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addInput('operator',new SelectInput(this,{
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
	}));
	this.addInput('radius',new XYInput(this,{
		min: 0,
		value: 0
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.MorphologyEffect();
	this.update();
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
}
MorphologyEffect.prototype.constructor = MorphologyEffect;
MorphologyEffect.prototype.__proto__ = Effect.prototype;

//DisplacementMap
function DisplacementMapEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addInput('scale',new NumberInput(this,{
		min: 0,
		step: 0.1,
		value: 1
	}));
	this.addInput('xChannelSelector',new SelectInput(this,{
		options: ['R','G','B','A']
	}));
	this.addInput('yChannelSelector',new SelectInput(this,{
		options: ['R','G','B','A']
	}));

	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.DisplacementMapEffect();
	this.update();
}
DisplacementMapEffect.prototype = {
	options: {
		title: 'DisplacementMap'
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			scale: this.inputs.scale.getValue(),
			xChannelSelector: this.inputs.xChannelSelector.getValue(),
			yChannelSelector: this.inputs.yChannelSelector.getValue()
		});
	}
}
DisplacementMapEffect.prototype.constructor = DisplacementMapEffect;
DisplacementMapEffect.prototype.__proto__ = Effect.prototype;

//Turbulence
function TurbulenceEffect(){
	Effect.apply(this,arguments);

	this.addInput('baseFrequency',new XYInput(this,{
		min: 0,
		step: 0.05,
		value: 0
	}));
	this.addInput('numOctaves',new NumberInput(this,{
		min: 0,
		value: 1
	}));
	this.addInput('seed',new NumberInput(this,{
		min: 0,
		value: 1
	}));
	this.addInput('stitchTiles',new SelectInput(this,{
		options: ['stitch','noStitch']
	}));
	this.addInput('type',new SelectInput(this,{
		options: ['turbulence','fractalNoise']
	}));

	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.TurbulenceEffect();
	this.update();
}
TurbulenceEffect.prototype = {
	options: {
		title: 'Turbulence'
	},
	update: function(){
		this.filter.attr({
			baseFrequency: this.inputs.baseFrequency.getValue(),
			numOctaves: this.inputs.numOctaves.getValue(),
			seed: this.inputs.seed.getValue(),
			stitchTiles: this.inputs.stitchTiles.getValue(),
			type: this.inputs.type.getValue()
		});
	}
}
TurbulenceEffect.prototype.constructor = TurbulenceEffect;
TurbulenceEffect.prototype.__proto__ = Effect.prototype;

//Merge
function MergeEffect(){
	Effect.apply(this,arguments);

	this.addInput('in 1',new EffectInput(this,{
		title: "in 1"
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.MergeEffect();
	this.update();
}
MergeEffect.prototype = {
	options: {
		title: 'Merge'
	},
    menu: [
        {
            type: 'item',
            icon: 'plus',
            title: 'Add Input',
            action: function(){
            	var a = Object.keys(this.inputs);
                this.addInput('in'+(a.length+1), new EffectInput(this,{
                	title: 'in '+(a.length+1)
                }));
                this.render();
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
                }
            }
        },
        {
            type: 'separator'
        },
        {
            type: 'item',
            icon: 'eye',
            title: 'Preview',
            action: function(){
                this.select();
            }
        },
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
            icon: 'trash-o',
            title: 'Delete',
            action: function(){
                this.remove();
            }
        }
    ],
	update: function(){
		this.filter.clear();
		for(var i in this.inputs){
			if(this.inputs[i].getValue()) this.filter.add(new SVG.MergeNode(this.inputs[i].getValue()));
		}
	}
}
MergeEffect.prototype.constructor = MergeEffect;
MergeEffect.prototype.__proto__ = Effect.prototype;

//composite
function CompositeEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addInput('operator',new SelectInput(this,{
		options: ['over','in','out','atop','xor','arithmetic']
	}));
	this.addInput('K1',new NumberInput(this,{
		value: 0
	}));
	this.addInput('K2',new NumberInput(this,{
		value: 0
	}));
	this.addInput('K3',new NumberInput(this,{
		value: 0
	}));
	this.addInput('K4',new NumberInput(this,{
		value: 0
	}));
	this.addOutput('result',new EffectOutput(this));

	this.filter = new SVG.CompositeEffect();
	this.update();

	this.render();
}
CompositeEffect.prototype = {
	options: {
		title: 'Composite'
	},
	update: function(inputs){
		if(this.inputs.operator.getValue() == 'arithmetic'){
			this.inputs.K1.show();
			this.inputs.K2.show();
			this.inputs.K3.show();
			this.inputs.K4.show();
			this.filter.attr({
				K1: this.inputs.K1.getValue(),
				K2: this.inputs.K2.getValue(),
				K3: this.inputs.K3.getValue(),
				K4: this.inputs.K4.getValue()
			})
			this.updateEndpoints();
		}
		else{
			this.inputs.K1.hide();
			this.inputs.K2.hide();
			this.inputs.K3.hide();
			this.inputs.K4.hide();
			this.filter.attr({
				K1: null,
				K2: null,
				K3: null,
				K4: null
			})
			this.updateEndpoints();
		}

		this.filter.attr({
			in: this.inputs.in.getValue(),
			in2: this.inputs.in2.getValue(),
			operator: this.inputs.operator.getValue()
		});
	}
}
CompositeEffect.prototype.constructor = CompositeEffect;
CompositeEffect.prototype.__proto__ = Effect.prototype;

//ColorMatrix
function ColorMatrixEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('type',new SelectInput(this,{
		options: ["matrix",'saturate','hueRotate','luminanceToAlpha']
	}));
	this.addInput('matrix',new MatrixSizeInput(this,{
		width: 5,
		height: 4
	}));
	this.addInput('saturate',new NumberInput(this,{
		min: 0,
		max: 1,
		step: .1,
		value: 0
	}));
	this.addInput('hueRotate',new NumberInput(this,{
		min: 0,
		max: 360,
		step: 10,
		value: 0
	}));

	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.ColorMatrixEffect();
	this.update();
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
	}
}
ColorMatrixEffect.prototype.constructor = ColorMatrixEffect;
ColorMatrixEffect.prototype.__proto__ = Effect.prototype;

//ConvolveMatrix
function ConvolveMatrixEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('order',new XYInput(this,{
		min: 1,
		value: 3
	}));
	this.addInput('matrix',new MatrixSizeInput(this,{
		width: 3,
		height: 3
	}));
	this.addInput('divisor',new NumberInput(this,{
		min: 0,
		value: 1
	}));
	this.addInput('bias',new NumberInput(this,{
		min: 0,
		value: 0
	}));
	this.addInput('edgeMode',new SelectInput(this,{
		options: ['duplicate','wrap','none']
	}));
	this.addInput('preserveAlpha',new SelectInput(this,{
		options: ['false','true']
	}));

	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.ConvolveMatrixEffect('');
	this.update();
}
ConvolveMatrixEffect.prototype = {
	styles: {
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
			order: this.inputs.order.getValue(),
			kernelMatrix: this.inputs.matrix.getValue(),
			divisor: this.inputs.divisor.getValue(),
			bias: this.inputs.bias.getValue(),
			edgeMode: this.inputs.edgeMode.getValue(),
			preserveAlpha: this.inputs.preserveAlpha.getValue()
		});
	}
}
ConvolveMatrixEffect.prototype.constructor = ConvolveMatrixEffect;
ConvolveMatrixEffect.prototype.__proto__ = Effect.prototype;

//blend
function BlendEffect(){
	Effect.apply(this,arguments);

	this.addInput('mode',new SelectInput(this,{
		options: ['normal','multiply','screen','darken','lighten']
	}));
	this.addInput('in',new EffectInput(this,{
		title: "in 1"
	}));
	this.addInput('in2',new EffectInput(this,{
		title: "in 2"
	}));
	this.addOutput('result',new EffectOutput(this));

	this.render();

	this.filter = new SVG.BlendEffect();
	this.update();
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
}
BlendEffect.prototype.constructor = BlendEffect;
BlendEffect.prototype.__proto__ = Effect.prototype;

//inputs
function InputEffect(){
	Effect.apply(this,arguments);

	this.addOutput('BackgroundImage',new EffectOutput(this,{
		title: 'BackgroundImage'
	},{
		value: 'BackgroundImage'
	}));
	this.addOutput('BackgroundAlpha',new EffectOutput(this,{
		title: 'BackgroundAlpha'
	},{
		value: 'BackgroundAlpha'
	}));
	this.addOutput('FillPaint',new EffectOutput(this,{
		title: 'FillPaint'
	},{
		value: 'FillPaint'
	}));
	this.addOutput('StrokePaint',new EffectOutput(this,{
		title: 'StrokePaint'
	},{
		value: 'StrokePaint'
	}));
	this.addOutput('SourceAlpha',new EffectOutput(this,{
		title: "SourceAlpha"
	},{
		value: 'SourceAlpha'
	}));
	this.addOutput('SourceGraphic',new EffectOutput(this,{
		title: "SourceGraphic"
	},{
		value: 'SourceGraphic'
	}));

	this.render();
}
InputEffect.prototype = {
	options: {
		title: 'Input'
	},
	menu: [],
	toggleButton: false
}
InputEffect.prototype.constructor = InputEffect;
InputEffect.prototype.__proto__ = Effect.prototype;

//output
function OutputEffect(){
	Effect.apply(this,arguments);

	this.addInput('in',new EffectInput(this,{
		title: "out"
	}));

	this.render();

	this.filter = new SVG.OffsetEffect()
	this.update();
}
OutputEffect.prototype = {
	options: {
		title: 'Output'
	},
	menu: [],
	toggleButton: false,
	update: function(){
		return this.inputs.in.getValue();
	},
	update: function(){
		this.filter.attr({
			in: this.inputs.in.getValue() || 'SourceGraphic',
			result: 'output'
		});

		this.arange();
	}
}
OutputEffect.prototype.constructor = OutputEffect;
OutputEffect.prototype.__proto__ = Effect.prototype;