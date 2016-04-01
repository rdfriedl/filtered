import {Component, View, ElementRef} from 'angular2/core';

import WelcomeComponent from './welcome.component.js';
import ExamplesComponent from './examples.component.js';
import ExportComponent from './export.component.js';
import LoadFilterComponent from './loadFilter.component.js';
import EffectsService from '../services/effects.service.js';

@Component({
	selector: 'toolbar'
})
@View({
	directives: [
		WelcomeComponent,
		ExamplesComponent,
		ExportComponent,
		LoadFilterComponent
	],
	template: require('../templates/toolbar.template.html')
})
export default class ToolbarComponent{
	constructor(_effectsService: EffectsService, _elementRef: ElementRef){
		this._effectsService = _effectsService;
		this._elementRef = _elementRef;
	}

	title = 'Filtered';
	baseEffects = [];
	prebuiltEffects = [];
	createEffect(effect){
		console.log('create: '+effect.name);
		this.title = effect.name;
	}

	ngOnInit(){
		//enable tooltips
		$(this._elementRef.nativeElement).find('[data-toggle="tooltip"]').tooltip();

		this.getEffects();
	}

	getEffects(){
		this.baseEffects = [];
		this.prebuiltEffects = [];
		return Promise.all([
			this._effectsService.getPrebuiltEffects().then(effects => this.prebuiltEffects = Array.from(effects)),
			this._effectsService.getBaseEffects().then(effects => this.baseEffects = Array.from(effects))
		]);
	}
}
