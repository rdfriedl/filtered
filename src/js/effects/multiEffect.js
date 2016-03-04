import Effect from './effect.js';
import * as inputs from './inputs.js';
import * as outputs from './outputs.js';

//multi filter
export default class MultiEffect extends Effect{
    constructor(){
        super(...arguments);

        for(var i = 0; i < this.menu.length; i++){
            if(this.menu[i].title == 'Help'){
                this.menu.splice(i,1);
                break;
            }
        }
        this.updateMenu();
    }
	options = {
		title: 'Multi'
	}
	getValue(){
		var a = Object.keys(this.filter);
		return this.filter[a[a.length-1]];
	}
	hide(){
		for(var i in this.filter){
			this.filter[i].remove();
		}
	}
	show(){
		for(var i in this.filter){
			filter.put(this.filter[i]);
		}
	}
	arange(){
        this.show();

        var a = Object.keys(this.filter);
        for (var i = a.length - 1; i >= 0; i--) {
            this.filter[a[i]].back();
        }

        for (var k in this.inputs) {
            if(this.inputs[k] instanceof inputs.EffectInput){
                this.inputs[k].arange();
            }
        }
	}
    select(){
        $('.effect').removeClass('selected');
        $(this.element).addClass('selected');

    	var a = Object.keys(this.filter);
    	previewFilter = this.filter[a[a.length-1]];
        page.outputEffect.update();
        page.editor.arange();
    }
    updatePostion(){
    	for(var i in this.filter){
            if(this.position.hasOwnProperty('x')){ this.filter[i].x(this.position.x + '%') } else { this.filter[i].attr('x',null) }
            if(this.position.hasOwnProperty('y')){ this.filter[i].y(this.position.y + '%') } else { this.filter[i].attr('y',null) }
            if(this.position.hasOwnProperty('width')){ this.filter[i].width(this.position.width + '%') } else { this.filter[i].attr('width',null) }
            if(this.position.hasOwnProperty('height')){ this.filter[i].height(this.position.height + '%') } else { this.filter[i].attr('height',null) }
    	}
    }
}
