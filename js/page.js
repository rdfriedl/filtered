function observable(val,fn){
	var o = ko.observable(val);
	o.subscribe(fn);
	return o;
}

page = {
	inputEffect: undefined,
	outputEffect: undefined,
	effects: {
		effects: [],
		effectsTypes: ko.observableArray([
			{
				title: 'Flood',
				effect: FloodEffect
			},
			{
				title: 'Offset',
				effect: OffsetEffect
			},
			{
				title: 'Merge',
				effect: MergeEffect
			},
			{
				title: 'Composite',
				effect: CompositeEffect
			},
		]),
		createEffect: function(){
			page.effects.effects.push(new this.effect());
		}
	},
	editor: {
		start: function(){
			page.inputEffect = new InputEffect();
			page.outputEffect = new OutputEffect();
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
		preview: {
			update: function(){
				filter.clear();
				page.outputEffect.getValue();
				console.log(filter.node);
			}
		}
	}
}

$(document).ready(function() {
	ko.applyBindings(page)
});