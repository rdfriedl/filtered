import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import inspectorTypes from './inspectorTypes';
import Input from 'core/Input';
import Point from '../connections/Point';
import InputWrapper from './InputWrapper';

@observer
export default class InputInspector extends Component{
	static PropTypes = {
		input: PropTypes.instanceOf(Input).isRequired
	}

	render(){
		let {input, children, ...props} = this.props;
		let InputType = inspectorTypes.get(input.constructor);

		let pointStyles = {
			position: "absolute",
			left: "0",
			top: "50%",
			display: "block"
		}

		return (
			<InputWrapper {...props}>
				{InputType && <InputType input={input}/>}
				{React.Children.toArray(children)}
				<Point port={input} style={pointStyles}/>
			</InputWrapper>
		)
	}
}
