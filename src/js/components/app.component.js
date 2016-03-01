import {Component, View, ElementRef} from 'angular2/core';

import PreviewComponent from './preivew.component.js';
import ToolbarComponent from './toolbar.component.js';

@Component({
	selector: 'app'
})
@View({
	directives: [PreviewComponent,ToolbarComponent],
	template: require('../templates/app.template.html'),
	styles: [require('!raw!../styles/app.styles.css')]
})
export default class AppComponent{
	constructor(_element: ElementRef){
		this.$element = $(_element.nativeElement);
	}
}
