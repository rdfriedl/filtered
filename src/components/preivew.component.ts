import {Component, ElementRef, DoCheck, OnInit} from 'angular2/core';

@Component({
	selector: 'preview',
	template: require('../templates/preview.template.html'),
	styles: [require('../styles/preview.styles.css')]
})
export default class PreviewComponent implements DoCheck, OnInit{
	constructor(private _elementRef: ElementRef){}

	ngOnInit(){
		//make it so the panel headers collapse the panels
		$(this._elementRef.nativeElement).find('.panel-heading a[data-toggle="collapse"]').parent().parent().click(function(){
	        $($(this).find('a[data-toggle="collapse"]').attr('href')).collapse('toggle');
	    });

	    //create preview svg
	    this._createSVG();

	    window.addEventListener('resize',() => this.centerContent());
	    this.centerContent();
	}

	ngDoCheck(){ //use instead of change
		this.updatePreview();
	}

	private svg: svgjs.Doc;
	private group: svgjs.G;
	private text: svgjs.Text;
	private image: svgjs.Image;

	private mode: string = 'text';
	private MODE_TEXT:string = 'text';
	private MODE_IMAGE:string = 'image';

	textColor: string = '#000000';
	textValue: string = 'Text';
	textFontFamilies: string[] = [
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
	textFontFamily: string = "Impact, Charcoal, sans-serif";
	textFontBold: boolean = false;
	textFontItalic: boolean = false;
	textFontStrikethrough: boolean = false;
	textFontUnderline: boolean = false;

	textSize: number = 200;
	textSizeMin: number = 100;
	textSizeMax: number = 500;

	textStrokeColor: string = '#880000';
	textStrokeSize: number = 20;
	textStrokeSizeMin: number = 0;
	textStrokeSizeMax: number = 80;

	imageURL: string = '';
	private imageURLTmp: string = '';

	_createSVG(){
	    this.svg = new SVG.Doc($(this._elementRef.nativeElement).find('.preview-svg')[0]);
		this.svg.viewbox({
			x: 0,
			y: 0,
			width: 1000,
			height: 500
		}).size(1000,500).style({
			width: '100%',
			height: 'auto'
		});
		this.group = this.svg.group();
		this.text = this.group.text('').attr('paint-order', 'stroke');
		this.image = this.group.image();
		this.image.loaded(() => {
			this.image.center(0,0);
		})

		this.updatePreview();
	}

	centerContent(){
		if(this.svg.node.ownerDocument) this.group.transform({
			x: this.svg.width()/2,
			y: this.svg.height()/2
		});
	}
	updatePreview(){
		switch(this.mode){
			case this.MODE_TEXT:
				this.image.hide();
				this.text.show();
				break;
			case this.MODE_IMAGE:
				this.image.show();
				this.text.hide();
				break;
		}

		var decoration = [];
		if(this.textFontUnderline) decoration.push('underline');
		if(this.textFontStrikethrough) decoration.push('line-through');

		//update text
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

		//update image
		if(this.image.attr('href') != this.imageURL){
			this.image.load(this.imageURL);
		}
		this.image.center(0,0);
	}

	showGoogleImages(){

	}
}
