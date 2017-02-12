import React, { Component } from 'react';

import Navbar from '../Navbar';

class App extends Component {
	render() {
		return (
			<div className="d-flex flex-column h-100">
				<Navbar/>
				<div className="card flex-grow">
					<h1>Home</h1>
				</div>
			</div>
		);
	}
}

export default App;
