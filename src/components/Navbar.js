import React, { Component } from 'react';
import pkg from '../../package.json';

import {Link} from 'react-router-dom';

export default class Navbar extends Component {
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<Link className="navbar-brand" to="/">Filtred {pkg.version}</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"/>
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/editor">Editor</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}
