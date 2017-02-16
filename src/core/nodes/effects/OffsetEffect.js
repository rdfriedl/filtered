import React from 'react';
import EffectNode from 'core/nodes/EffectNode';
import NumberInput from 'core/inputs/NumberInput';
import EffectInput from 'core/inputs/EffectInput';

export default class OffsetEffect extends EffectNode{
	constructor(...args){
		super(...args)

		// add inputs
		this.addInput(new EffectInput('in'));
		this.addInput(new NumberInput('x'));
		this.addInput(new NumberInput('y'));
	}

	title = "Offset";

	render(){
		return (
			<feOffset in={this.ins.in} dx={this.ins.x} dy={this.ins.y} result={this.outs.out}></feOffset>
		)
	}
}
