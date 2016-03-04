import {Injectable} from 'angular2/core';

@Injectable()
export default class ExamplesService{
	constructor(){}

	getExamples(){
		return Promise.resolve(_examples);
	}
}

var _examples = [];
for(let i = 1; i <= 15; i++){
	_examples.push({
		data: require('../../examples/json/'+i+'.json'),
		imageURL: require('../../examples/screenshots/'+i+'.png')
	});
}
