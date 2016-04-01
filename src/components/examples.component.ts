import {Component} from 'angular2/core';
import ExamplesService from '../services/examples.service';

@Component({
	selector: 'examples',
	template: require('../templates/examples.template.html')
})
export default class ExamplesComponent{
	constructor(private _examplesService: ExamplesService){}

	examples = []

	ngOnInit(){
		this.getExamples();
	}

	getExamples(){
		this._examplesService.getExamples().then(examples => this.examples = examples);
	}

	onSelect(example){
		console.log('load example');
		console.log(example);
	}
}
