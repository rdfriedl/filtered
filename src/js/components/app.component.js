import {Component,View,ElementRef} from 'angular2/core';

import PreviewComponent from './preivew.component.js';
import WelcomeComponent from './welcome.component.js';

@Component({
	selector: 'app'
})
@View({
	directives: [PreviewComponent,WelcomeComponent],
	template: require('./app.component.html')
})
export default class AppComponent{}
