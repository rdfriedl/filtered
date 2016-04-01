import Effect from './effect.js';
import * as inputs from './inputs.js';
import * as outputs from './outputs.js';

//inputs
export default class InputEffect extends Effect{
	constructor(){
        super(...arguments);

		this.addOutput('BackgroundImage',outputs.EffectOutput,{
			title: 'BackgroundImage'
		},{
			value: 'BackgroundImage'
		});
		this.addOutput('BackgroundAlpha',outputs.EffectOutput,{
			title: 'BackgroundAlpha'
		},{
			value: 'BackgroundAlpha'
		});
		this.addOutput('FillPaint',outputs.EffectOutput,{
			title: 'FillPaint'
		},{
			value: 'FillPaint'
		});
		this.addOutput('StrokePaint',outputs.EffectOutput,{
			title: 'StrokePaint'
		},{
			value: 'StrokePaint'
		});
		this.addOutput('SourceAlpha',outputs.EffectOutput,{
			title: "SourceAlpha"
		},{
			value: 'SourceAlpha'
		});
		this.addOutput('SourceGraphic',outputs.EffectOutput,{
			title: "SourceGraphic"
		},{
			value: 'SourceGraphic'
		});

		this.render();
		this.update();
	    this.updateElement();
		this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Inputs'
	}
	menu = [
		{
			type: 'item',
			icon: 'object-ungroup',
			title: 'Position',
			action: function(){
				this.editPosition();
			}
		},
        {
            type: 'item',
            icon: 'question',
            title: 'Help',
            action: function(){
                $('#help').modal('show');
                $('#help iframe').attr('src','help/index.html#FilterElement');
            }
		}
	]
	toggleButton = false
	updatePostion(){ //use filter and not this.filter
        if(this.position.hasOwnProperty('x')){ filter.x(this.position.x + '%') } else { filter.attr('x',null) }
        if(this.position.hasOwnProperty('y')){ filter.y(this.position.y + '%') } else { filter.attr('y',null) }
        if(this.position.hasOwnProperty('width')){ filter.width(this.position.width + '%') } else { filter.attr('width',null) }
        if(this.position.hasOwnProperty('height')){ filter.height(this.position.height + '%') } else { filter.attr('height',null) }
	}
}
