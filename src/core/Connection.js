import {observable, computed, runInAction} from 'mobx';

export default class Connection{
	/**
	 * @param  {Input} output - the output to start from
	 * @param  {Output} input - the input to connect to
	 */
	constructor(output, input) {
		this.output = output;
		this.input = input;

		runInAction(() => {
			this.output.connection = this;
			this.input.connection = this;
		})
	}

	@observable output = undefined;
	@observable input = undefined;

	@computed get value(){
		return this.output? this.output.value : undefined;
	}
}
