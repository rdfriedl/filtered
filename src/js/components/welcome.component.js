import {Component, View, Input, ElementRef} from 'angular2/core';

@Component({
	selector: 'welcome'
})
@View({
	template: require('../../../README.md')
})
export default class WelcomeComponent{
	constructor(_element: ElementRef){
		this._element = _element;
		this.$el = $(this._element.nativeElement);
	}

	@Input() title = true;

	ngOnInit(){
		this.$el.find('img').css('width','100%');

		//remove the title and the subtitle
		if(!this.title){
			this.$el.find('h1').first().remove();
			this.$el.find('p').first().remove();
		}
	}
}
