import React, {Component} from 'react';

import Navbar from '../Navbar';
import InspectorCard from './inspector/InspectorCard';

import NodeManager from 'core/NodeManager';
import ConnectionManager from './connections/ConnectionManager';

import MathNode from 'core/nodes/MathNode';
import OffsetEffect from 'core/nodes/effects/OffsetEffect';

export default class Edit extends Component{
	constructor(props) {
		super(props);
		let math = new MathNode(), offset = new OffsetEffect();
		this.manager.addNode(math);
		this.manager.addNode(offset);

		// create the connection
		this.manager.createConnection(math.outs.out, offset.ins.x);
	}

	manager = new NodeManager();

	state = {
		viewport: {
			x: 0,
			y: 0,
			zoom: 1
		},
		dragging: false
	};

	dragStartViewport = {};
	cursorStart = {x: 0, y: 0};
	dragStart(event){
		if(event.target.id !== 'viewport') return;

		// cache viewport
		Object.assign(this.dragStartViewport, this.state.viewport);

		// get start position
		this.cursorStart.x = event.screenX;
		this.cursorStart.y = event.screenY;

		this.setState({dragging: true});
	}
	dragMove(event){
		if(!this.state.dragging) return;

		this.setState({
			viewport: {
				x: this.dragStartViewport.x + (event.screenX - this.cursorStart.x),
				y: this.dragStartViewport.y + (event.screenY - this.cursorStart.y)
			}
		})

		this.connectionManager.updateConnections();
	}
	dragStop(event){
		this.dragMove(event);
		this.setState({dragging: false});
	}

	render(){
		let viewportStyles = {
			position: 'absolute',
			cursor: this.state.dragging? 'move' : 'initial'
		}
		let contentStyles = {
			position: 'absolute',
			transform: `translate(${this.state.viewport.x}px, ${this.state.viewport.y}px)`,
			left: '50%',
			top: '50%'
		}

		let onDrag = () => {
			this.connectionManager.updateConnections();
		}

		return (
			<div className="d-flex flex-column h-100">
				<div id="viewport" className="w-100 h-100" style={viewportStyles} onMouseDown={this.dragStart.bind(this)} onMouseMove={this.dragMove.bind(this)} onMouseUp={this.dragStop.bind(this)}>
					<ConnectionManager connections={this.manager.connections} ref={ref => this.connectionManager = ref}>
						<div className="content" style={contentStyles}>{this.manager.nodes.map(node => (
							<InspectorCard node={node} key={node.id} onDrag={onDrag}/>
						))}</div>
					</ConnectionManager>
				</div>
				<Navbar/>
				<div className="row flex-grow">
					<div className="col-2">
						<div className="card h-100">
							left
						</div>
					</div>
					<div className="col-2 offset-8">
						<div className="card h-100">
							right
						</div>
					</div>
				</div>
			</div>
		);
	}
}
