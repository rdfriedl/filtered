import React, { Component } from 'react';
import pkg from '../../../package.json';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
// import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Link} from 'react-router';

class App extends Component {
	state = {
		value: 3
	};

  	handleChange = (event, index, value) => this.setState({value});

	render() {
		return (
			<div is layout="column top-stretch" style={{height: '100vh'}}>
				<Toolbar>
					<ToolbarGroup>
						<ToolbarTitle text={`Filtered v${pkg.version}`} />
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarTitle text="Options" />
						<FontIcon className="fa fa-plus" />
						<ToolbarSeparator />
						<Link to="/edit"><RaisedButton label="Create Broadcast" primary={true} /></Link>
						<IconMenu
							iconButtonElement={
								<IconButton touch={true}>
									<NavigationExpandMoreIcon />
								</IconButton>
							}
						>
							<MenuItem primaryText="Download" />
							<MenuItem primaryText="More Info" />
						</IconMenu>
					</ToolbarGroup>
				</Toolbar>
				<div is self="size-x1" layout="row stretch-justify">
					<div>
						left
					</div>
					<div is self="size-x1">
						Home
					</div>
					<div>
						right
					</div>
				</div>
			</div>
		);
	}
}

export default App;
