import {Component} from 'angular2/core';

import PreviewComponent from './preivew.component';
import ToolbarComponent from './toolbar.component';
import EditorComponent from './editor.component';
import ExamplesService from '../services/examples.service';
import EffectsService from '../services/effects.service';

@Component({
	selector: 'app',
	providers: [
		ExamplesService,
		EffectsService
	],
	directives: [
		PreviewComponent,
		ToolbarComponent,
		EditorComponent
	],
	template: require('../templates/app.template.html'),
	styles: [require('../styles/app.styles.css')]
})
export default class AppComponent{}
