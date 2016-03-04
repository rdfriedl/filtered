import {Component, View, ElementRef} from 'angular2/core';
import Clipboard from 'clipboard';

@Component({
	selector: 'export'
})
@View({
	template: require('../templates/export.template.html')
})
export default class ExportComponent{
	constructor(_elementRef: ElementRef){
		this._elementRef = _elementRef;
	}

	ngOnInit(){
		this.clipboard = new Clipboard(this._elementRef.nativeElement.querySelectorAll('.copy'));
	}

	xml = "<filter></filter>";
	json = "{}";
	url = "http://rdfriedl.github.io/filtered";

	updateExports(){

	}
}
