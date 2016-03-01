import {Component, View} from 'angular2/core';

import WelcomeComponent from './welcome.component.js';
import ExamplesComponent from './examples.component.js';
import ExportComponent from './export.component.js';

@Component({
	selector: 'toolbar'
})
@View({
	directives: [WelcomeComponent,ExamplesComponent,ExamplesComponent],
	template: require('../templates/toolbar.template.html')
})
export default class ToolbarComponent{}
