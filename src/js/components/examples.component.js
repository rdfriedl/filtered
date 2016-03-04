import {Component, View} from 'angular2/core';
import ExamplesService from '../services/examples.service.js';

@Component({
	selector: 'examples'
})
@View({
	template: require('../templates/examples.template.html')
})
export default class ExamplesComponent{
	constructor(_examplesService: ExamplesService){
		this._examplesService = _examplesService;
		this.getExamples();
	}

	examples = []

	getExamples(){
		this._examplesService.getExamples().then(examples => this.examples = examples);

		console.log(this.examples)
	}
}
