import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Node from 'core/Node';
import NodeInspector from './NodeInspector';
import inspectorTypes from './inspectorTypes';

export default class InspectorCard extends Component{
	constructor(...args){
		super(...args);

		this.dragStart = this.dragStart.bind(this);
		this.dragMove = this.dragMove.bind(this);
		this.dragStop = this.dragStop.bind(this);
	}

	static propTypes = {
		node: PropTypes.instanceOf(Node).isRequired,
		containerScale: PropTypes.number,
		onDrag: PropTypes.func
	};

	static defaultProps = {
		containerScale: 1
	};

	state = {
		position: {
			x: 0,
			y: 0
		}
	};

	dragStartPosition = {};
	cursorStart = {x: 0, y: 0};
	dragStart(event){
		if(event.target !== this.refs.header) return;

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
				x: this.dragStartPosition.x + (event.screenX - this.cursorStart.x) / this.containerScale,
				y: this.dragStartPosition.y + (event.screenY - this.cursorStart.y) / this.containerScale
			}
		});

		if(this.props.onDrag)
			this.props.onDrag();
	}
	dragStop(event){
		this.dragMove(event);
		this.setState({dragging: false});
	}

	componentWillMount() {
		window.addEventListener('mousedown', this.dragStart);
		window.addEventListener('mousemove', this.dragMove);
		window.addEventListener('mouseup', this.dragStop);
	}

	componentWillUnmount() {
		window.removeEventListener('mousedown', this.dragStart);
		window.removeEventListener('mousemove', this.dragMove);
		window.removeEventListener('mouseup', this.dragStop);
	}

	render(){
		let {node, containerScale, ...props} = this.props;
		let cardStyles = {
			position: 'absolute',
			transform: 'translate(-50%, -50%)',
			left: this.state.position.x,
			top: this.state.position.y,
			minWidth: 250,
			userSelect: 'none'
		};
		let InspectorType = inspectorTypes.get(node.constructor) || NodeInspector;

		this.containerScale = containerScale;

		return (
			<div className="card" style={cardStyles} {...props}>
				<div className="card-header bk-primary p-2" style={{cursor: 'move'}} ref="header">
					{node.title || ''}
					<div className="btn-group btn-group-sm float-right">
						<button className="btn btn-danger" onClick={() => node.remove()}>X</button>
					</div>
				</div>
				<div className="card-block p-2">
					<InspectorType node={node}/>
				</div>
			</div>
		)
	}
}
