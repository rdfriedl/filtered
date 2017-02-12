import React, {Component} from 'react';

import Navbar from '../Navbar';
import MathEffect from 'core/nodes/MathNode';

export default class Edit extends Component{
	node = new MathEffect();

	state = {
		value: 3
	};

  	handleChange = (event, index, value) => this.setState({value});

	render(){
		return (
			<div className="d-flex flex-column h-100">
				<Navbar/>
				<div className="row flex-grow">
					<div className="col-2">
						left
					</div>
					<div className="col-8">
						<div className="card h-100">
							<h2 className="text-center">Editor</h2>
						</div>
					</div>
					<div className="col-2">
						right
					</div>
				</div>
			</div>
		);
	}
}
