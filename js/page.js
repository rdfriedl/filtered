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
				title: 'Blur',
				effect: GaussianBlurEffect
			},
			{
				title: 'Morphology',
				effect: MorphologyEffect
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
			page.editor.exproted(filter.node.outerHTML.replace(/</g,'\r\n<'));
		}
	},
	saveFilter: function(){ //save filter to url

	},
	loadFilter: function(){ //load filter to url

	}
}

$(document).ready(function() {
	ko.applyBindings(page)
});