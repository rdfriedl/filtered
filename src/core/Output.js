import {observable} from 'mobx';
import Connection from './Connection';
import uuid from 'uuid/v4';

/**
 * @class the base class for a Node output
 */
export default class Output{
	constructor(name, defaultValue) {
		if(!name)
			throw new Error('a name is required for an output');

		this.name = name;
		this.defaultValue = defaultValue;
	}

	/** @type {String} the id of this Node */
	id = uuid();

	/** @type {Node} the Node this input is connected to */
	@observable.ref node = undefined;

	/** @type {Connection} the connection that connects this input to an {@link Output} */
	@observable.ref connection = undefined;

	/** @type {String} the name of the output */
	@observable name = '';

	/** the value of the output */
	@observable value = undefined;

	/**
	 * connects to an input
	 * @param  {Input} input
	 * @return {this}
	 */
	connectTo(input){
		if(input.approveConnection(this)){
			this.connection = new Connection(this, input);
		}
		return this;
	}

	setValue(value){
		this.value = value;
		return this;
	}

	toString(){
		return this.value;
	}
}
