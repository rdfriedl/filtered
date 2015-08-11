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
				title: 'Blend',
				effect: BlendEffect
			},
			{
				title: 'ColorMatrix',
				effect: ColorMatrixEffect
			},
			{
				title: 'Composite',
				effect: CompositeEffect
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
				title: 'Flood',
				effect: FloodEffect
			},
			{
				title: 'GaussianBlur',
				effect: GaussianBlurEffect
			},
			{
				title: 'Merge',
				effect: MergeEffect
			},
			{
				title: 'Morphology',
				effect: MorphologyEffect
			},
			{
				title: 'Offset',
				effect: OffsetEffect
			},
			// { this is removed because the position editor only support %
			// 	title: 'Tile',
			// 	effect: TileEffect
			// },
			{
				title: 'Turbulence',
				effect: TurbulenceEffect
			},
		]),
		createEffect: function(){
			page.effects._effects.push(new this.effect({},{
				left: '30%',
				top: '30%'
			}));
			page.editor.arange();
			editor.repaintEverything();
		},
		removeEffect: function(effect){
			var a = page.effects._effects;
			if(a.indexOf(effect) !== -1){
				a.splice(a.indexOf(effect),1);
			}
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
						updateImageSize();
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
				url: observable('',function(url){
					previewImage.load(url);
				}),
				change: function(){
					pickerApiLoaded && picker.setVisible(true);
				}
			}
		}
	},
	export:{
		json: function(){
			var json = {
				effects: [],
				connections: [],
				inputEffectID: page.inputEffect.id,
				outputEffectID: page.outputEffect.id,
				inputPosition: {
					left: $(page.inputEffect.element).css('left'),
					top: $(page.inputEffect.element).css('top')
				},
				outputPosition: {
					left: $(page.outputEffect.element).css('left'),
					top: $(page.outputEffect.element).css('top')
				}
			};
			var effects = page.effects._effects;

			for(var i = 0; i < effects.length; i++){
				var effect = effects[i];
				var data = {
					id: effect.id,
					type: effect.constructor.name,
					inputs: {},
					left: effect.element.style.left,
					top: effect.element.style.top
				}
				for(var k in effect.inputs){
					if(effect.inputs[k] instanceof EffectInput){
						if(effect.inputs[k].connection){
							json.connections.push([
								[effect.id,effect.inputs[k].id],
								[effect.inputs[k].connection.effect.id,effect.inputs[k].connection.id]
							]);
						}
					}
					else{
						data.inputs[k] = effect.inputs[k].getAttrValue() || undefined;
					}
				}
				json.effects.push(data);
			}

			//export output connections
			var effect = page.outputEffect;
			for(var k in effect.inputs){
				if(effect.inputs[k] instanceof EffectInput){
					if(effect.inputs[k].connection){
						json.connections.push([
							[effect.id,effect.inputs[k].id],
							[effect.inputs[k].connection.effect.id,effect.inputs[k].connection.id]
						]);
					}
				}
			}

			return json;
		}
	},
	import: {
		json: function(json){
			var effects = {};

			effects[json.inputEffectID] = page.inputEffect;
			effects[json.outputEffectID] = page.outputEffect;

			$(page.inputEffect.element).css(json.inputPosition);
			$(page.outputEffect.element).css(json.outputPosition);

			for(var i = 0; i < json.effects.length; i++){
				var data = json.effects[i];

				var effect = new window[data.type]({},{
					left: data.left,
					top: data.top
				});
				page.effects._effects.push(effect);
				effects[data.id] = effect;

				for(var k in data.inputs){
					effect.inputs[k].setValue(data.inputs[k]);
				}

				effect.update();
			}

			//make connections
			var getInput = function(id){
				if(effects[id[0]] && effects[id[0]].inputs[id[1]]){
					return effects[id[0]].inputs[id[1]];
				}
			}
			var getOutput = function(id){
				if(effects[id[0]] && effects[id[0]].outputs[id[1]]){
					return effects[id[0]].outputs[id[1]];
				}
			}
			for(var i = 0; i < json.connections.length; i++){
				var data = json.connections[i];
				var input = getInput(data[0]);
				var output = getOutput(data[1]);

				if(!input || !output) continue;

				input.setValue(output);
			}

			page.editor.arange();
		}
	},
	exportFilter: {
		filter: ko.observable(''),
		json: ko.observable(''),
		url: ko.observable(''),
		export: function(){
			$('.prettyprinted').children().remove();
			page.exportFilter.filter('');
			page.exportFilter.json('');
			page.exportFilter.url('');

			//if theres something selected deselect it
			$('.effect').removeClass('selected');
			page.outputEffect.update();
			
			page.exportFilter.filter(filter.node.outerHTML.replace(/></g,'>\n<'));

			var json = page.export.json();

			page.exportFilter.json(JSON.stringify(json, null, 4));

			var str = btoa(JSON.stringify(json));
			if(str.length < 2083){
				page.exportFilter.url(location.origin+location.pathname +'?' + createSearch({
					save: str,
					previewImage: (page.editor.preview.image.url() !== '')? page.editor.preview.image.url() : undefined,
					mode: (page.editor.preview.mode() !== 'text')? page.editor.preview.mode() : undefined
				}));
			}
			else{
				page.exportFilter.url('Error: url to long');
			}
			
			$('.prettyprinted').removeClass('prettyprinted');
			prettyPrint();
		}
	},
	loadFilter: function(){ //load filter to url
		try{
			var json = parseSearch().save;

			if(!json || json == '') return;

			json = atob(json);
			json = JSON.parse(json);

			page.import.json(json);
		}
		catch(e){
			console.error('failed to load save from hash');
			console.error(e);
		}
	},
	loadSearch: function(){
		if(parseSearch().mode){
			page.editor.preview.mode(parseSearch().mode || page.editor.preview.mode());
		}
		if(parseSearch().previewImage){
			page.editor.preview.image.url(parseSearch().previewImage || page.editor.preview.image.url());
		}
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