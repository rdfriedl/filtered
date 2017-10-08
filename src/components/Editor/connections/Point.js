import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Input from 'core/Input';
import Output from 'core/Output';

export default class ConnectionPoint extends Component{
	get position(){
		let rect = this.el.getClientRects()[0];
		return rect ? {
			x: rect.left,
			y: rect.top
		} : {};
	}

	render(){
		let {port, ...props} = this.props;

		// tell the ConnectionManager that this element is rendering this port
		this.context.registerPoint(port, this);

		return <span ref={ref => this.el = ref} {...props}>{React.Children.toArray(this.props.children)}</span>
	}

	componentWillUnmount() {
		this.context.unregisterPoint(this.props.port, this);
	}

	static PropTypes = {
		port: PropTypes.oneOfType([
			PropTypes.instanceOf(Input),
			PropTypes.instanceOf(Output)
		]).isRequired
	};

	static contextTypes = {
		registerPoint: PropTypes.func.isRequired,
		unregisterPoint: PropTypes.func.isRequired
	};
}
