import {Component, ElementRef} from 'angular2/core';
import EffectsService, {InputEffect, OutputEffect, Effect, MultiEffect} from '../services/effects.service';
import * as styles from '../ts/jsplumbStyles';
import FilterService from '../services/filter.service';

@Component({
	selector: 'editor',
	template: require('../templates/editor.template.html')
})
export default class EditorComponent{
	constructor(private _elementRef: ElementRef, private _effectsService: EffectsService, private _filterService: FilterService){}

	ngOnInit(){
		console.info('stared editor');
	}
}
