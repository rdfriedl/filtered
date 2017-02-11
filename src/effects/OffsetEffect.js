import React from 'react';
import EffectNode from 'core/nodeTypes/EffectNode';
import NumberInput from 'core/inputTypes/NumberInput';
import EffectInput from 'core/inputTypes/EffectInput';

export default class OffsetEffect extends EffectNode{
	constructor(...args){
		super(...args)

		// add inputs
		this.addInput(new EffectInput('in'));
		this.addInput(new NumberInput('x'));
		this.addInput(new NumberInput('y'));
	}

	render(){
		return (
			<feOffset in={this.ins.in} dx={this.ins.x} dy={this.ins.y} result={this.outs.out}></feOffset>
		)
	}
}
