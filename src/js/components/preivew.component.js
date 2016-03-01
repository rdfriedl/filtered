import {Component, View, ElementRef} from 'angular2/core';

@Component({
	selector: 'preview'
})
@View({
	template: require('../templates/preview.template.html'),
	styles: [require('!raw!../styles/preview.styles.css')]
})
export default class PreviewComponent{
	constructor(_element: ElementRef){
		this.$element = $(_element.nativeElement);
	}

	ngOnInit(){
		//make it so the panel headers collapse the panels
		this.$element.find('.panel-heading a[data-toggle="collapse"]').parent().parent().click(function(){
	        $($(this).find('a[data-toggle="collapse"]').attr('href')).collapse('toggle');
	    });
	}
}
