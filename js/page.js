function observable(val,fn){
	var o = ko.observable(val);
	o.subscribe(fn);
	return o;
}

page = {
	inputEffect: undefined,
	outputEffect: undefined,
	effects: {
		_effects: [],
		effects: ko.observableArray([
			{
				title: 'Shadow',
				effect: ShadowEffect
			},
			{
				title: 'Stroke',
				effect: StrokeEffect
			},
			{
				title: 'Recolor',
				effect: RecolorEffect
			},
			{
				title: 'Blur',
				effect: GaussianBlurEffect
			},
			{
				title: 'Sepiatone',
				effect: SepiatoneEffect
			},
			{
				title: 'GreyScale',
				effect: GreyScaleEffect
			},
			{
				title: 'Bump',
				effect: BumpEffect
			}
		]),
		baseEffects: ko.observableArray([
			{
				title: 'Flood',
				effect: FloodEffect
			},
			{
				title: 'Offset',
				effect: OffsetEffect
			},
			{
				title: 'GaussianBlur',
				effect: GaussianBlurEffect
			},
			{
				title: 'Morphology',
				effect: MorphologyEffect
			},
			{
				title: 'ColorMatrix',
				effect: ColorMatrixEffect
			},
			{
				title: 'ConvolveMatrix',
				effect: ConvolveMatrixEffect
			},
			{
				title: 'DisplacementMap',
				effect: DisplacementMapEffect
			},
			{
				title: 'Turbulence',
				effect: TurbulenceEffect
			},
			{
				title: 'Merge',
				effect: MergeEffect
			},
			{
				title: 'Composite',
				effect: CompositeEffect
			},
			{
				title: 'Blend',
				effect: BlendEffect
			},
		]),
		createEffect: function(){
			page.effects._effects.push(new this.effect());
			page.editor.arange();
		}
	},
	editor: {
		start: function(){
			page.inputEffect = new InputEffect();
			page.outputEffect = new OutputEffect();

			for (var i = 0; i < page.effects.effects().length; i++) {
				page.effects.effects()[i].create = page.effects.createEffect.bind(page.effects.effects()[i]);
			};
			for (var i = 0; i < page.effects.baseEffects().length; i++) {
				page.effects.baseEffects()[i].create = page.effects.createEffect.bind(page.effects.baseEffects()[i]);
			};
		},
		zoom: {
			zoomLevel: observable(1,function(val){
		        editor.setZoom(val);
		        $('#editor').transition({
		            scale: val
		        },0)
			}),
			zoomIn: function(){
				this.zoomLevel(this.zoomLevel() * 1.1)
			},
			zoomOut: function(){
				this.zoomLevel(this.zoomLevel() * 0.9)
			}
		},
		pan: {

		},
		arange: function(){
			for (var i = 0; i < page.effects._effects.length; i++) {
				page.effects._effects[i].hide();
			};
			page.outputEffect.arange();
		},
		exproted: ko.observable(''),
		exportFilter: function(){
			//if theres something selected deselect it
			$('.effect').removeClass('selected');
			page.outputEffect.update();
			
			page.editor.exproted(filter.node.outerHTML.replace(/></g,'>\n<'));
			$('.prettyprinted').removeClass('prettyprinted');
			prettyPrint();
		},
		preview: {
			mode: observable('text',function(val){
				switch(val){
					case 'text':
						previewImage.hide();
						previewText.show();
						svg.size('100%','100%');
						break;
					case 'image':
						previewImage.show();
						previewText.hide();
						svg.size('100%',$(svg.node).width());
						break;
				}
				updatePreviewPosition();
			}),
			text: {
				text: observable('Text',function(val){
					previewText.text(val);
        			updatePreviewPosition();
				}),
				color: observable('#000000',function(val){
					previewText.attr('fill',val);
				}),
				font: {
					fonts: ko.observableArray([
						"Georgia, serif",
						'"Palatino Linotype", "Book Antiqua", Palatino, serif',
						'"Times New Roman", Times, serif',
						'Arial, Helvetica, sans-serif',
						'"Arial Black", Gadget, sans-serif',
						'"Comic Sans MS", cursive, sans-serif',
						'Impact, Charcoal, sans-serif',
						'"Lucida Sans Unicode", "Lucida Grande", sans-serif',
						'Tahoma, Geneva, sans-serif',
						'"Trebuchet MS", Helvetica, sans-serif',
						'Verdana, Geneva, sans-serif',
						'"Courier New", Courier, monospace',
						'"Lucida Console", Monaco, monospace'
					]),
					font: observable("'Ultra', serif",function(val){
						previewText.font({
							'font-family': val
						});
						updatePreviewPosition();
					}),
					weights: ['normal','lighter','bold','bolder'],
					weight: observable(false,function(val){
						previewText.font({
							'font-weight': val
						})
	        			updatePreviewPosition();
					}),
					size: observable(120,function(val){
						previewText.font({
							'font-size': val+'px'
						})
	        			updatePreviewPosition();
					}),
				},
				stroke: {
					color: observable('#000000',function(val){
						previewText.attr('stroke',val);
					}),
					size: observable(0,function(val){
						previewText.attr('stroke-width',val);
					})
				}
			},
			image: {
				url: observable('',function(){

				}),
				change: function(){
					pickerApiLoaded && picker.setVisible(true);
				}
			}
		}
	},
	saveFilter: function(){ //save filter to url

	},
	loadFilter: function(){ //load filter to url

	},

	toggle: function(observable){
		return function(){
			this(!this());
		}.bind(observable);
	},
	increase: function(ob,amount){
		return _.partial(function(ob,amount){
			amount = amount || 1;
			ob(ob()+amount);
		},ob,amount);
	},
	decrease: function(ob,amount){
		return _.partial(function(ob,amount){
			amount = amount || 1;
			ob(ob()-amount);
		},ob,amount);
	},
	set: function(ob,amount){
		return function(ob,amount){
			if(typeof amount == "function"){
				ob(amount());
			}
			else{
				ob(amount);
			}
		}.bind(undefined,ob,amount);
	},
}

$(document).ready(function() {
	ko.applyBindings(page)
});