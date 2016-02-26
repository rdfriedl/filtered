import ko from 'knockout';
import {observable} from './util.js';

import html from '../html/preview.html';

//main class for handling the preview
export default class Preview{
	constructor(){
		this.element = $(html);
	}

	static get inst(){
		return this._inst || (this._inst = new Preview());
	}

	init(editor){
		this.editor = editor;
		this.svg = new SVG(this.element.find('#preview-svg')[0]);
		this.createModal()

		ko.applyBindings(this.modal,this.element[0]);
	}

	update(){

	}

	createModal(){
		var that = this;
		this.modal = {
			mode: observable('text',function(val){
				switch(val){
					case 'text':
						previewImage.hide();
						previewText.show();
						svg.size('100%','100%');
						break;
					case 'image':
						previewImage.show();
						previewText.hide();
						svg.size('100%',$(svg.node).width());
						updateImageSize();
						break;
				}
				updatePreviewPosition();
			}),
			text: {
				text: observable('Text',function(val){
					previewText.text(val);
					updatePreviewPosition();
				}),
				color: observable('#000000',function(val){
					previewText.attr('fill',val);
				}),
				font: {
					fonts: observable([
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
					]),
					font: observable("'Ultra', serif",function(val){
						previewText.font({
							'font-family': val
						});
						updatePreviewPosition();
					}),
					weights: ['normal','lighter','bold','bolder'],
					weight: observable(false,function(val){
						previewText.font({
							'font-weight': val
						});
						updatePreviewPosition();
					}),
					size: observable(120,function(val){
						previewText.font({
							'font-size': val+'px'
						});
						updatePreviewPosition();
					}),
				},
				stroke: {
					color: observable('#000000',function(val){
						previewText.attr('stroke',val);
					}),
					size: observable(0,function(val){
						previewText.attr('stroke-width',val);
					})
				}
			},
			image: {
				url: observable('',function(url){
					previewImage.load(url);
				}),
				change: function(){
    				window.pickerCallbackFunction = function(url){
    					page.editor.preview.image.url(url);
    				};
					if(window.pickerApiLoaded) picker.setVisible(true);
				}
			},

			toggle: function(observable){
				return function(){
					this(!this());
				}.bind(observable);
			},
			increase: function(ob,amount){
				return _.partial(function(ob,amount){
					amount = amount || 1;
					ob(ob()+amount);
				},ob,amount);
			},
			decrease: function(ob,amount){
				return _.partial(function(ob,amount){
					amount = amount || 1;
					ob(ob()-amount);
				},ob,amount);
			},
			set: function(ob,amount){
				return function(ob,amount){
					if(typeof amount == "function"){
						ob(amount());
					}
					else{
						ob(amount);
					}
				}.bind(undefined,ob,amount);
			}
		}
	}
}
