import {Component, View} from 'angular2/core';

import PreviewComponent from './preivew.component.js';
import ToolbarComponent from './toolbar.component.js';
import ExamplesService from '../services/examples.service.js';
import EffectsService from '../services/effects.service.js';

@Component({
	selector: 'app',
	providers: [
		ExamplesService,
		EffectsService
	]
})
@View({
	directives: [
		PreviewComponent,
		ToolbarComponent
	],
	template: require('../templates/app.template.html'),
	styles: [require('!raw!../styles/app.styles.css')]
})
export default class AppComponent{}
