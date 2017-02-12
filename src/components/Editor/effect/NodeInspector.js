import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import Node from 'core/Node';

const inspectorTypes = new Map();

inspectorTypes.set(require('core/inputs/NumberInput'), require('./inputs/NumberInput'))

console.log(inspectorTypes);

@observer
export default class NodeInspector extends Component{
	render(){
		return (
			<div></div>
		)
	}

	static PropTypes = {
		node: PropTypes.instanceOf(Node)
	}
}
