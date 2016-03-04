import {Component, View, Input, ElementRef} from 'angular2/core';

@Component({
	selector: 'welcome'
})
@View({
	template: require('!html?root=.!markdown!../../../README.md')
})
export default class WelcomeComponent{
	constructor(_element: ElementRef){
		this._element = _element;
		this.$element = $(this._element.nativeElement);
	}

	@Input() title = true;

	ngOnInit(){
		this.$element.find('img').css('width','100%');

		//remove the title and the subtitle
		if(!this.title){
			this.$element.find('h1').first().remove();
			this.$element.find('p').first().remove();
		}
	}
}
