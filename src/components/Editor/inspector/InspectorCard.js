import React, {Component, PropTypes} from 'react';
import Node from 'core/Node';
import NodeInspector from './NodeInspector';
import inspectorTypes from './inspectorTypes';

export default class InspectorCard extends Component{
	PropTypes = {
		node: PropTypes.instanceOf(Node).isRequired,
		onDrag: PropTypes.func
	}

	state = {
		position: {
			x: 0,
			y: 0
		}
	}

	dragStartPosition = {};
	cursorStart = {x: 0, y: 0};
	dragStart(event){
		if(event.target.id !== 'header') return;

		// cache position
		Object.assign(this.dragStartPosition, this.state.position);

		// get start position
		this.cursorStart.x = event.screenX;
		this.cursorStart.y = event.screenY;

		this.setState({dragging: true});
	}
	dragMove(event){
		if(!this.state.dragging) return;

		this.setState({
			position: {
				x: this.dragStartPosition.x + (event.screenX - this.cursorStart.x),
				y: this.dragStartPosition.y + (event.screenY - this.cursorStart.y)
			}
		})

		if(this.props.onDrag)
			this.props.onDrag();
	}
	dragStop(event){
		this.dragMove(event);
		this.setState({dragging: false});
	}


	render(){
		let {node, ...props} = this.props;
		let cardStyles = {
			position: 'absolute',
			transform: 'translate(-50%, -50%)',
			left: this.state.position.x,
			top: this.state.position.y,
			'minWidth': 250
		}
		let InspectorType = inspectorTypes.get(node.constructor) || NodeInspector;

		return (
			<div className="card" style={cardStyles} {...props}>
				<div id="header" className="card-header bk-primary p-2" style={{cursor: 'move'}} onMouseDown={this.dragStart.bind(this)} onMouseMove={this.dragMove.bind(this)} onMouseUp={this.dragStop.bind(this)}>
					{node.title || ''}
					<div className="btn-group btn-group-sm float-right">
						<button className="btn btn-danger">X</button>
					</div>
				</div>
				<div className="card-block p-2">
					<InspectorType node={node}/>
				</div>
			</div>
		)
	}
}
