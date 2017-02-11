import {observable, computed} from 'mobx';
import Output from './Output.js';
import uuid from 'uuid/v4';

/**
 * @class the base class for a Node input
 */
export default class Input{
	constructor(name, defaultValue) {
		if(!name)
			throw new Error('a name is required for an output');

		this.name = name;
		this.defaultValue = defaultValue;
	}

	/** @type {String} the id of this Input */
	id = uuid();

	/** @type {Node} the Node this input is connected to */
	@observable.ref node = undefined;

	/** @type {Connection} the connection that connects this input to an {@link Output} */
	@observable.ref connection = undefined;

	/** @type {String} the name of the input */
	@observable name = '';

	/** @type {*} the default value that is returned when there is no connection */
	@observable defaultValue = undefined;

	/**
	 * returns the value of the input
	 * returns the defaultValue if there is no connection
	 */
	@computed get value(){
		return this.parseValue(this.connection ? this.connection.value : this.defaultValue);
	}

	/**
	 * makes sure the value matches the inputs type
	 * @private
	 * @param  {*} value
	 * @return {*}
	 */
	parseValue(value){
		return value;
	}

	/**
	 * @param  {Outpu} output
	 * @return {boolean}
	 */
	acceptConnection(output){
		return output instanceof Output;
	}
}
