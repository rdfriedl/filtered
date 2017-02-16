import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';

@observer
export default class ConnectionManager extends Component{
	points = new Map();

	getChildContext(){
		return {
			registerPoint: (port, el) => this.points.set(port, el),
			unregisterPoint: (port, el) => this.points.get(port) === el && this.points.delete(port),
			updateConnections: this.updateConnections.bind(this)
		}
	}

	static childContextTypes = {
		registerPoint: PropTypes.func.isRequired,
		unregisterPoint: PropTypes.func.isRequired,
		updateConnections: PropTypes.func
	};

	static PropTypes = {
		connections: PropTypes.array.isRequired
	};

	updateConnections(){
		this.render();
	}

	render(){
		let svgStyles = {
			position: 'fixed',
			left: 0,
			top: 0,
			pointerEvents: 'none'
		}

		return (
			<div>
				{React.Children.toArray(this.props.children)}
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" style={svgStyles}>
					<g style={{pointerEvents: 'auto'}}>{this.props.connections.map(connection => {
						let inputEl = this.points.get(connection.input);
						let outputEl = this.points.get(connection.output);
						if(!inputEl || !outputEl)
							return null;

						let start = outputEl.position;
						let end = inputEl.position;
						let path = `M ${start.x},${start.y} L ${end.x},${end.y}`;
						return (
							<path stroke="black" strokeWidth="2" d={path} key={connection.id}></path>
						);
					})}</g>
				</svg>
			</div>
		);
	}
}
