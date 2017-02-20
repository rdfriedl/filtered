import {observable, action} from 'mobx'
import Node from './Node';
import Connection from './Connection';

export default class NodeManager{
	@observable nodes = [];
	@observable connections = [];

	/**
	 * @param  {String|Function|Node} id - id, class or node
	 * @return {Node}
	 */
	getNode(id){
		return this.nodes.find(node => node.id === id || node.constructor === id || node === id);
	}

	hasNode(id){
		return !!this.getNode(id);
	}

	@action
	addNode(node){
		if(!(node instanceof Node)) return this;

		this.nodes.push(node);
		node.manager = this;

		return this;
	}

	@action
	removeNode(id){
		let node = this.getNode(id);
		if(node){
			node.dispose();
			this.nodes.splice(this.nodes.indexOf(node), 1);
			node.manager = undefined;
		}

		return this;
	}

	@action
	clearNodes(){
		let nodes = Array.from(this.nodes);
		nodes.forEach(node => this.removeNode(node));
		return this;
	}

	hasInput(input){
		for (var i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i].hasInput(input))
				return true;
		}
		return false;
	}
	hasOutput(output){
		for (var i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i].hasOutput(output))
				return true;
		}
		return false;
	}

	/**
	 * creates and adds a new {@link Connection}
	 * @param  {Output} output
	 * @param  {Input} input
	 * @return {this}
	 */
	@action
	createConnection(output, input){
		if(!input || !output)
			throw new Error('createConnection requires a output and an input');

		if(!this.hasInput(input))
			throw new Error('input has to be a input of Node that is part of the NodeManager');

		if(!this.hasOutput(output))
			throw new Error('output has to be a output of Node that is part of the NodeManager');

		let connection = new Connection(output, input, this);
		this.connections.push(connection);
		return this;
	}

	/**
	 * gets a connections
	 * @param  {String|Connection|Input|Output} id
	 * @return {Connection}
	 */
	getConnection(id){
		return this.connections.find(conn => conn.id === id || conn === id || conn.input === id || conn.output === id);
	}

	/**
	 * disconnects and removes a connection
	 * @param  {String|Connection|Input|Output} id
	 * @return {this}
	 */
	@action
	removeConnection(id){
		let connection = this.getConnection(id);
		if(connection){
			connection.disconnect();
			this.connections.splice(this.connections.indexOf(connection), 1);
		}
		return this;
	}

	@action
	clearConnections(){
		let connections = Array.from(this.connections);
		connections.forEach(connection => this.removeConnection(connection));
		return this;
	}
}
