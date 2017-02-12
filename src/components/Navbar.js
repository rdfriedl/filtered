import React, { Component } from 'react';
import pkg from '../../package.json';

import {Link} from 'react-router';

export default class Navbar extends Component {
	render() {
		return (
			<nav className="navbar navbar-toggleable-sm navbar-inverse bg-primary">
				<Link className="navbar-brand" to="/">Filtred {pkg.version}</Link>

				<div className="collapse navbar-collapse">
					<ul className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/">Home</Link>
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
