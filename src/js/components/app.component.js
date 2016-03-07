import {Component, View} from 'angular2/core';

import PreviewComponent from './preivew.component.js';
import ToolbarComponent from './toolbar.component.js';
import EditorComponent from './editor.component.js';
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
		ToolbarComponent,
		EditorComponent
	],
	template: require('../templates/app.template.html'),
	styles: [require('../styles/app.styles.css')]
})
export default class AppComponent{}
