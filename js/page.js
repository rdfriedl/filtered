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
				title: 'ComponentTransfer',
				effect: ComponentTransferEffect
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
				title: 'Image',
				effect: ImageEffect
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
		createEffect: function(type){
			var effect = page.effects.getEffect(type);

			if(effect){
				page.effects._effects.push(new (effect.effect)({},{
					left: '30%',
					top: '30%'
				}));
				page.editor.arange();
			}
		},
		getEffect: function(type){
			var a = page.effects.effects().concat(page.effects.baseEffects());
			type = type || '';
			type = type.replace('Effect','');
			for(var i in a){
				if(a[i].title.toLowerCase() == type.toLowerCase()){
					return a[i];
				}
			}
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
				page.effects.effects()[i].create = page.effects.createEffect.bind(undefined,page.effects.effects()[i].title);
			};
			for (var i = 0; i < page.effects.baseEffects().length; i++) {
				page.effects.baseEffects()[i].create = page.effects.createEffect.bind(undefined,page.effects.baseEffects()[i].title);
			};

			$.getJSON('examples/examples.json', function(json) {
				page.examples.examples(json);
			});
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
    				pickerCallbackFunction = function(url){
    					page.editor.preview.image.url(url);
    				};
					pickerApiLoaded && picker.setVisible(true);
				}
			}
		},

		clear: function(){
			while(page.effects._effects.length > 0){
				page.effects._effects[0].remove();
			}
		}
	},
	examples: {
		examples: ko.observableArray([]),
		select: function(){
			$.getJSON(this.json, function(json) {
				if(!json) return;

				page.editor.clear();
				page.import.json(json,true);
			});
		}
	},
	export:{
		json: function(exportPreview){
			var json = {
				effects: [],
				inputEffect: page.inputEffect.toJSON(),
				outputEffect: page.outputEffect.toJSON(),
				previewImage: (page.editor.preview.image.url() !== '' && exportPreview)? page.editor.preview.image.url() : undefined,
				mode: (page.editor.preview.mode() !== 'text' && exportPreview)? page.editor.preview.mode() : undefined
			};
			var effects = page.effects._effects;

			for(var i = 0; i < effects.length; i++){
				json.effects.push(effects[i].toJSON());
			}

			return json;
		},
		url: function(){
			var json = page.export.json();

			var str = btoa(JSON.stringify(json));
			if(str.length < 2083){
				return location.origin+location.pathname +'?' + createSearch({
					save: str,
					previewImage: (page.editor.preview.image.url() !== '')? page.editor.preview.image.url() : undefined,
					mode: (page.editor.preview.mode() !== 'text')? page.editor.preview.mode() : undefined
				});
			}
			return location.origin+location.pathname
		},
		xml: function(){
			var str = filter.node.outerHTML
				.replace(new RegExp('<feOffset id="'+page.outputEffect.filter.id()+'(.*?)<\/feOffset>'),'')
				.replace(/id="(.*?)"( |)/g,'');
			return formatXml(str).replace(/><\/(.*?)>/g,'/>');
		}
	},
	import: {
		json: function(json,importPreview){
			var effects = {};
			var replaceID = function(obj,id,replaceWith){
				for(var i in obj){
					if(typeof obj[i] == 'object'){
						replaceID(obj[i],id,replaceWith);
					}
					else if(obj[i] == id){
						obj[i] = replaceWith;
					}
				}
			}

			for(var i = 0; i < json.effects.length; i++){
				var data = json.effects[i];

				var effectType = page.effects.getEffect(data.type);
				if(!effectType) continue;

				var effect = new (effectType.effect);
				effects[effect.id] = effect;
				replaceID(json,data.id,effect.id);
				page.effects._effects.push(effect);
				//cant import the data yet because not all the effects have been created
			}

			//set the input/output effects ids
			if(json.outputEffect){
				replaceID(json,json.outputEffect.id,page.outputEffect.id);
			}
			if(json.inputEffect){
				replaceID(json,json.inputEffect.id,page.inputEffect.id);
			}

			//import data
			for(var i = 0; i < json.effects.length; i++){
				var effect = effects[json.effects[i].id];
				if(effect) effect.fromJSON(json.effects[i]);
			}
			if(json.outputEffect){
				page.outputEffect.fromJSON(json.outputEffect);
			}
			if(json.inputEffect){
				page.inputEffect.fromJSON(json.inputEffect);
			}

			if(json.mode && importPreview){
				page.editor.preview.mode(json.mode || page.editor.preview.mode());
			}
			if(json.previewImage && importPreview){
				page.editor.preview.image.url(json.previewImage || page.editor.preview.image.url());
			}

			page.editor.arange();
		},
		url: function(url){
			var json = parseSearch(url).save;

			if(!json || json == '') return;

			json = atob(json);
			json = JSON.parse(json);

			page.import.json(json);
		},
		xml: function(xml){
			var $xml = $(xml);
			var filterEl = $xml.is('filter')? $xml[0] : $xml.find('filter')[0];
			var filters = page.effects.effects();
			var effects = {};
			var replaceID = function(el,id,replaceWith){
				if(el.getAttribute('id') == id){
					el.setAttribute('id',replaceWith);
				}
				for(var i = 0; i < el.children.length; i++) {
					replaceID(el.children[i]);
				}
			}

			for (var i = 0; i < filterEl.children.length; i++) {
			 	var el = filterEl.children[i];
				var type = el.nodeName.toLowerCase().replace('fe','');

				var effectType = page.effects.getEffect(type);
				if(!effectType) continue;

				var effect = new (effectType.effect);

				//index it
				effects[el.getAttribute('id') || effect.id] = {
					effect: effect,
					el: el
				};

				if(el.getAttribute('id')){
					replaceID(filterEl,el.getAttribute('id'),effect.id);
				}
				page.effects._effects.push(effect);
				//cant import the data yet because not all the effects have been created
			};

			//import
			for(var i in effects){
				effects[i].effect.fromElement(effects[i].el);
			}
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
			
			page.exportFilter.filter(page.export.xml());
			page.exportFilter.json(JSON.stringify(page.export.json(true), null, 2));
			page.exportFilter.url(page.export.url());
			
			$('.prettyprinted').removeClass('prettyprinted');
			prettyPrint();
		}
	},
	importFilter: {
		data: ko.observable(''),
		importFilter: function(){
			page.editor.clear();
			page.import.xml(page.importFilter.data());
			page.importFilter.data('');
		}
	},
	loadFilter: function(){ //load filter to url
		try{
			page.import.url(location.href);
		}
		catch(e){
			console.error('failed to load from url');
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