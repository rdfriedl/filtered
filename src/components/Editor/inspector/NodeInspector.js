import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import Node from 'core/Node';
import InputInspector from './InputInspector';
import OutputInspector from './OutputInspector';
import inspectorTypes from './inspectorTypes';

@observer
class NodeInspector extends Component{
	render(){
		let {node, ...props} = this.props;
		return (
			<div {...props}>
				{node.inputs.filter(input => inspectorTypes.has(input.constructor)).map(input => (
					<InputInspector input={input} key={input.id}/>
				))}
				{node.outputs.filter(output => inspectorTypes.has(output.constructor)).map(output => (
					<OutputInspector key={output.id} output={output}/>
				))}
			</div>
		)
	}

	static PropTypes = {
		node: PropTypes.instanceOf(Node).isRequired
	}
}

export {NodeInspector as default};
