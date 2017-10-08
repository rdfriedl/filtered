import {observable, runInAction, computed, action} from 'mobx';
import Input from './Input';
import Output from './Output';
import uuid from 'uuid/v4';

export default class Node{
	/** @type {String} the id of this Node */
	id = uuid();

	@observable.shallow inputs = [];
	@observable.shallow outputs = [];

	@observable.ref manager = undefined;

	/** returns a keymap of all the inputs with the keys being the inputs name */
	@computed get ins(){
		let ins = {};
		this.inputs.forEach(input => ins[input.name] = input);
		return ins;
	}
	/** returns a keymap of all the outputs with the keys being the outputs name */
	@computed get outs(){
		let outs = {};
		this.outputs.forEach(output => outs[output.name] = output);
		return outs;
	}

	/**
	 * adds an input to this node
	 * @param {Input} input
	 * @returns {this}
	 */
	addInput(input){
		if(input instanceof Input){
			runInAction(() => {
				input.node = this;
				this.inputs.push(input);
			})
		}

		return this;
	}

	/**
	 * gets an input from the name, id, or index
	 * @param  {String|Number|Input} id - the name, id, or index
	 * @return {Input}
	 */
	getInput(id){
		return this.inputs.find((input, i) => (
			input.id === id ||
			input.name === id ||
			(typeof id === 'function' && (
				id === input.constructor ||
				id.isPrototypeOf(input.constructor))
			) ||
			input === id ||
			id === i
		));
	}

	/**
	 * @param  {String|Number|Input} id - the name, id, or index
	 * @return {Input}
	 */
	hasInput(id){
		return !!this.getInput(id);
	}

	/**
	 * removes an input
	 * @param  {String|Number|Input} id - the id or the input to remove
	 * @return {this}
	 */
	@action
	removeInput(id){
		let input = this.getInput(id);

		input.dispose();
		this.inputs.splice(this.inputs.indexOf(input), 1);
		input.node = undefined;

		return this;
	}

	/**
	 * adds an output to this node
	 * @param {Output} output
	 * @returns {this}
	 */
	addOutput(output){
		if(output instanceof Output){
			runInAction(() => {
				output.node = this;
				this.outputs.push(output);
			})
		}

		return this;
	}

	/**
	 * gets an output from the name, id, or index
	 * @param  {String|Number|Output} id - the name, id, or index
	 * @return {Output}
	 */
	getOutput(id){
		return this.outputs.find((output, i) => (
			output.id === id ||
			output.name === id ||
			(typeof id === 'function' && (
					id === output.constructor ||
					id.isPrototypeOf(output.constructor))
			) ||
			output === id ||
			id === i
		));
	}

	/**
	 * @param  {String|Number|Output} id - the name, id, or index
	 * @return {Output}
	 */
	hasOutput(id){
		return !!this.getOutput(id);
	}

	/**
	 * removes an output
	 * @param  {String|Number|Output} id - the id or the output to remove
	 * @return {this}
	 */
	@action
	removeOutput(id){
		let output = this.getOutput(id);

		output.dispose();
		this.outputs.splice(this.outputs.indexOf(output), 1);
		output.node = undefined;

		return this;
	}

	dispose(){
		this.inputs.forEach(input => input.dispose());
		this.outputs.forEach(output => output.dispose());
		return this;
	}

	remove(){
		if(this.manager)
			this.manager.removeNode(this);

		return this;
	}
}
