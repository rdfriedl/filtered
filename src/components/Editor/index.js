import React, {Component} from 'react';
import {observer} from 'mobx-react';

import Navbar from '../Navbar';
import InspectorCard from './inspector/InspectorCard';

import NodeManager from 'core/NodeManager';
import ConnectionManager from './connections/ConnectionManager';

import MathNode from 'core/nodes/MathNode';
import OffsetEffect from 'core/nodes/effects/OffsetEffect';

@observer
export default class Edit extends Component{
	constructor(props) {
		super(props);
		let math = new MathNode(), math2 = new MathNode(), offset = new OffsetEffect();
		this.manager.addNode(math).addNode(math2).addNode(offset);

		// create the connection
		this.manager.createConnection(math.outs.out, offset.ins.x);
		this.manager.createConnection(math2.outs.out, offset.ins.y);
		this.manager.createConnection(math2.outs.out, math.ins.in1);
	}

	manager = new NodeManager();

	state = {
		x: 0,
		y: 0,
		zoom: 1,
		dragging: false
	};

	dragStartViewport = {};
	cursorStart = {x: 0, y: 0};
	dragStart(event){
		if(event.target.id !== 'viewport') return;

		// cache viewport
		Object.assign(this.dragStartViewport, this.state);

		// get start position
		this.cursorStart.x = event.screenX;
		this.cursorStart.y = event.screenY;

		this.setState({dragging: true});
	}
	dragMove(event){
		if(!this.state.dragging) return;

		this.setState({
			x: this.dragStartViewport.x + (event.screenX - this.cursorStart.x),
			y: this.dragStartViewport.y + (event.screenY - this.cursorStart.y)
		})
	}
	dragStop(event){
		this.dragMove(event);
		this.setState({dragging: false});
	}

	componentDidMount() {
		this.refs.connectionManager.updateConnections();
	}
	componentDidUpdate(){
		this.refs.connectionManager.updateConnections();
	}

	render(){
		let viewportStyles = {
			position: 'absolute',
			cursor: this.state.dragging? 'move' : 'initial'
		}
		let contentStyles = {
			position: 'absolute',
			transform: `translate(${this.state.x}px, ${this.state.y}px) scale(${this.state.zoom})`,
			left: '50%',
			top: '50%'
		}

		let onNodeMove = () => {
			// make the component rerender
			this.setState({});
		}

		let zoomEvent = (e) => {
			this.setState({
				zoom: Math.min(Math.max(this.state.zoom * (Math.sign(-e.deltaY)*0.1 + 1), 0.2), 5)
			})
		}

		return (
			<div className="d-flex flex-column h-100">
				<div id="viewport" className="w-100 h-100" style={viewportStyles} onMouseDown={this.dragStart.bind(this)} onMouseMove={this.dragMove.bind(this)} onMouseUp={this.dragStop.bind(this)} onWheel={zoomEvent}>
					<ConnectionManager connections={this.manager.connections} scale={this.state.zoom} ref="connectionManager">
						<div className="content" style={contentStyles}>{this.manager.nodes.map(node => (
							<InspectorCard node={node} key={node.id} onDrag={onNodeMove} containerScale={this.state.zoom}/>
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
