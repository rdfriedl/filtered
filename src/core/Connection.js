import {computed, runInAction, action} from 'mobx';
import uuid from 'uuid/v4';

export default class Connection{
	/**
	 * @param  {Input} output - the output to start from
	 * @param  {Output} input - the input to connect to
	 */
	constructor(output, input, manager) {
		if(!output || !input || !manager)
			throw new Error('Connection requires a output, input and a manager');

		this.output = output;
		this.input = input;
		this.manager = manager;

		runInAction(() => {
			this.output.connection = this;
			this.input.connection = this;
		})
	}

	/** @type {String} the id of this Input */
	id = uuid();

	manager = undefined;

	output = undefined;
	input = undefined;

	@computed get value(){
		return this.output? this.output.value : undefined;
	}

	/** diconnects the connection and remove it from the manager */
	@action
	remove(){
		if(!this.manager) return this;

		this.manager.removeConnection(this);
		this.disconnect();
	}

	@action
	disconnect(){
		if(this.input)
			this.input = this.input.connection = undefined;

		if(this.output)
			this.output = this.output.connection = undefined;

		return this;
	}
}
