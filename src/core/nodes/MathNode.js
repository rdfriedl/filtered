import {autorun, observable} from 'mobx';
import Node from '../Node';
import NumberInput from '../inputs/NumberInput';
import NumberOutput from '../outputs/NumberOutput';

export default class MathNode extends Node{
	constructor(...args){
		super(...args);

		this.addInput(new NumberInput('in1'));
		this.addInput(new NumberInput('in2'));
		this.addOutput(new NumberOutput('out'));

		autorun(this.updateOutput.bind(this));
	}

	@observable operation = 'add';

	// options
	title = 'Math Node';

	updateOutput(){
		let {in1, in2} = this.ins;
		let {out} = this.outs;
		switch(this.operation){
			case '+':
			case 'add':
			default:
				out.value = in1.value + in2.value;
				break;
			case '-':
			case 'sub':
			case 'subtract':
				out.value = in1.value - in2.value;
				break;
			case '*':
			case 'multiply':
				out.value = in1.value * in2.value;
				break;
			case '/':
			case 'divide':
				out.value = in1.value / in2.value;
				break;
		}
	}
}
