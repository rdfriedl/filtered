import {Component, ElementRef} from 'angular2/core';
import SVG from 'svg.js';

@Component({
	selector: 'preview',
	template: require('../templates/preview.template.html'),
	styles: [require('../styles/preview.styles.css')]
})
export default class PreviewComponent{
	constructor(private _elementRef: ElementRef){
		this.$element = $(_elementRef.nativeElement);
	}

	ngOnInit(){
		//make it so the panel headers collapse the panels
		this.$element.find('.panel-heading a[data-toggle="collapse"]').parent().parent().click(function(){
	        $($(this).find('a[data-toggle="collapse"]').attr('href')).collapse('toggle');
	    });

	    //create preview svg
	    this._createSVG();

	    window.addEventListener('resize',() => this.centerContent());
	    this.centerContent();
	}

	ngDoCheck(){ //use instead of chnage
		this.updatePreview();
	}

	textColor = '#000000';
	textValue = 'Text';
	textFontFamilies = [
		"Georgia, serif",
		'"Palatino Linotype", "Book Antiqua", Palatino, serif',
		'"Times New Roman", Times, serif',
		'Arial, Helvetica, sans-serif',
		'"Arial Black", Gadget, sans-serif',
		'"Comic Sans MS", cursive, sans-serif',
		'Impact, Charcoal, sans-serif',
		'"Lucida Sans Unicode", "Lucida Grande", sans-serif',
		'Tahoma, Geneva, sans-serif',
		'"Trebuchet MS", Helvetica, sans-serif',
		'Verdana, Geneva, sans-serif',
		'"Courier New", Courier, monospace',
		'"Lucida Console", Monaco, monospace'
	];
	textFontFamily = "Impact, Charcoal, sans-serif";
	textFontBold = false;
	textFontItalic = false;
	textFontLineThrough = false;
	textFontUnderline = false;

	textSize = 100;
	textSizeMin = 30;
	textSizeMax = 200;

	textStrokeColor = '#880000';
	textStrokeSize = 5;
	textStrokeSizeMin = 0;
	textStrokeSizeMax = 50;

	imageURL = '';
	imageURLTmp = '';

	private $element;
	private mode = PreviewComponent.MODE_TEXT;
	private svg: svgjs.Doc;
	private group: svgjs.G;
	private text: svgjs.Text;

	static MODE_TEXT = 'text';
	static MODE_IMAGE = 'image';

	_createSVG(){
	    this.svg = new SVG.Doc($(this._elementRef.nativeElement).find('.preview-svg')[0]);
		this.group = this.svg.group();
		this.text = this.group.text('').attr('paint-order', 'stroke');

		new SVG.PathArray('string');

		this.updatePreview();
	}

	centerContent(){
		if(this.svg.node.ownerDocument) this.group.move(this.svg.node.getClientRects()[0].width/2,this.svg.node.getClientRects()[0].height/2);
	}
	updatePreview(){
		var decoration = [];
		if(this.textFontUnderline) decoration.push('underline');
		if(this.textFontLineThrough) decoration.push('line-through');

		this.text.font({
			family: this.textFontFamily,
			size: this.textSize,
			weight: this.textFontBold? 'bold' : 'normal',
			style: this.textFontItalic? 'italic' : 'normal'
		}).style({
			'text-decoration': decoration.join(' ')
		}).stroke({
			color: this.textStrokeColor,
			width: this.textStrokeSize
		}).text(this.textValue).fill(this.textColor).center(0,0);
	}

	showGoogleImages(){

	}
}
