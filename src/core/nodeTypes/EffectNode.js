import Node from '../Node';
import EffectOutput from '../outputTypes/EffectOutput';

export default class EffectNode extends Node{
	constructor(...args){
		super(...args);

		// since filter effects only have out output
		this.addOutput(new EffectOutput('out').setValue(this));
	}

	toString(){
		return `effect-${this.id}`;
	}

	render(){}
}
