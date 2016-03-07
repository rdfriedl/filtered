import {Component, View, ElementRef} from 'angular2/core';
import EffectsService, {InputEffect, OutputEffect, Effect, MultiEffect} from '../services/effects.service.js';
import $ from 'jquery';
var jsPlumb = window.jsPlumb;// import jsplumb from 'jsplumb';
import * as styles from '../jsplumbStyles.js';

@Component({
	selector: 'editor'
})
@View({
	template: require('../templates/editor.template.html')
})
export default class EditorComponent{
	constructor(_elementRef: ElementRef, _effectsService: EffectsService){
		this._elementRef = _elementRef;
		this._effectsService = _effectsService;
	}

	ngOnInit(){

	}
}
