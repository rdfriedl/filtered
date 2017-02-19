import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import inspectorTypes from './inspectorTypes';
import Output from 'core/Output';
import Point from '../connections/Point';
import InputWrapper from './InputWrapper';

@observer
export default class OutputInspector extends Component{
	static PropTypes = {
		output: PropTypes.instanceOf(Output).isRequired
	}

	render(){
		let {output, children, ...props} = this.props;
		let OutputType = inspectorTypes.get(output.constructor);

		let pointStyles = {
			position: "absolute",
			right: "0",
			top: "50%",
			display: "block"
		}

		return (
			<InputWrapper {...props}>
				{OutputType && <OutputType output={output}/>}
				{React.Children.toArray(children)}
				<Point port={output} style={pointStyles}/>
			</InputWrapper>
		)
	}
}
