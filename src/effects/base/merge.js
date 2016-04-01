import Effect from '../effect.js';
import * as inputs from '../inputs.js';
import * as outputs from '../outputs.js';

//Merge
export default class MergeEffect extends Effect{
	constructor(){
        super(...arguments);

		this.addInput('in 1',inputs.EffectInput,{
			title: "in 1"
		});
		this.addInput('in 2',inputs.EffectInput,{
			title: "in 2"
		});
		this.addOutput('result',outputs.EffectOutput);

		this.filter = new SVG.MergeEffect();

		this.menu = [
			{
				type: 'item',
				icon: 'plus',
				title: 'Add Input',
				action: function(){
					var a = Object.keys(this.inputs);
					this.addInput('in'+(a.length+1),inputs.EffectInput,{
						title: 'in '+(a.length+1)
					});
					this.render();
					this.updateEndpoints();
				}
			},
			{
				type: 'item',
				icon: 'minus',
				title: 'Remove Input',
				action: function(){
					var a = Object.keys(this.inputs);
					if(a.length > 0){
						this.removeInput(a[a.length-1]);
						this.render();
						this.updateEndpoints();
					}
				}
			},
			{
				type: 'separator'
			}
		].concat(this.menu);
		this.updateMenu();

		this.render();
		this.update();
	    this.updateElement();
		this.updateEndpoints();
	    this.updatePostion();
	}
	options = {
		title: 'Merge'
	}
	fromJSON(data,dontUpdate){
		data = data || {};

		if(data.inputs){
			for(var k in data.inputs){
				if(!this.inputs[k]){
					this.addInput(k,inputs.EffectInput,{
						title: k
					});
				}
				this.inputs[k].fromJSON(data.inputs[k]);
			}
		}

		if(data.style){
			this.style.top = data.style.top;
			this.style.left = data.style.left;
			this.applyStyles();
			this.updateEndpoints();
		}

		if(data.position){
			this.position.x = data.position.x !== undefined? data.position.x : this.position.x;
			this.position.y = data.position.y !== undefined? data.position.y : this.position.y;
			this.position.width = data.position.width !== undefined? data.position.width : this.position.width;
			this.position.height = data.position.height !== undefined? data.position.height : this.position.height;
			this.updatePostion();
		}

		if(!dontUpdate){
			this.render();
			this.updateEndpoints();
			this.update();
		}
	}
	update(){
		this.filter.clear();
		for(var i in this.inputs){
			if(this.inputs[i].getAttrValue()) this.filter.add(new SVG.MergeNode(this.inputs[i].getAttrValue()));
		}
	}
};
