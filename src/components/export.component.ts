import {Component, ElementRef} from 'angular2/core';

@Component({
	selector: 'export',
	template: require('../templates/export.template.html')
})
export default class ExportComponent{
	constructor(private _elementRef: ElementRef){}

	// private clipboard: any;
	ngOnInit(){
		// this.clipboard = new Clipboard(this._elementRef.nativeElement.querySelectorAll('.copy'));
	}

	xml = "<filter></filter>";
	json = "{}";
	url = "http://rdfriedl.github.io/filtered";

	updateExports(){

	}
}
