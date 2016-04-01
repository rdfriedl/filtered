import {Component, Input, ElementRef} from 'angular2/core';

@Component({
	selector: 'welcome',
	template: require('../../README.md')
})
export default class WelcomeComponent{
	constructor(private _elementRef: ElementRef){}

	@Input() title = true;

	ngOnInit(){
		let $element = $(this._elementRef.nativeElement);
		$element.find('img').css('width','100%');

		//remove the title and the subtitle
		if(!this.title){
			$element.find('h1').first().remove();
			$element.find('p').first().remove();
		}
	}
}
