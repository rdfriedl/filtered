import React, { Component } from 'react';
import logo from '../../res/logo.svg';
import './App.css';
import readme from '../../../README.md';

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React, Hello World!!!</h2>
				</div>
				<div className="App-intro" dangerouslySetInnerHTML={{__html: readme}}></div>
			</div>
		);
	}
}

export default App;
