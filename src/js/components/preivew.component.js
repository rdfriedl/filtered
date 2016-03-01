import {Component,View,ElementRef} from 'angular2/core';

@Component({
	selector: 'preview'
})
@View({
	template: require('./preview.component.html')
})
export default class PreviewComponent{
	constructor(_element: ElementRef){
		this._element = _element;
	}
}
