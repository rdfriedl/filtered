import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
				{node.outputs.filter(output => inspectorTypes.has(output.constructor)).map((output, i, a) => (
					<OutputInspector key={output.id} output={output} isLast={i === a.length-1} isFirst={i === 0}/>
				))}
			</div>
		)
	}

	static PropTypes = {
		node: PropTypes.instanceOf(Node).isRequired
	}
}

export {NodeInspector as default};
