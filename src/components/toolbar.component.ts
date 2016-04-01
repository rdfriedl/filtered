import {Component, ElementRef} from 'angular2/core';

import WelcomeComponent from './welcome.component';
import ExamplesComponent from './examples.component';
import ExportComponent from './export.component';
import LoadFilterComponent from './loadFilter.component';
import EffectsService from '../services/effects.service';

@Component({
	selector: 'toolbar',
	directives: [
		WelcomeComponent,
		ExamplesComponent,
		ExportComponent,
		LoadFilterComponent
	],
	template: require('../templates/toolbar.template.html')
})
export default class ToolbarComponent{
	constructor(private _effectsService: EffectsService, private _elementRef: ElementRef){}

	title = 'Filtered';
	baseEffects:any[] = [];
	prebuiltEffects:any[] = [];
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
