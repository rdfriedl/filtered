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

class App extends Component {
	state = {
		value: 3
	};

  	handleChange = (event, index, value) => this.setState({value});

	render() {
		return (
			<div>
				<Toolbar>
					<ToolbarGroup>
						<ToolbarTitle text={`Filtered v${pkg.version}`} />
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarTitle text="Options" />
						<FontIcon className="fa fa-plus" />
						<ToolbarSeparator />
						<RaisedButton label="Create Broadcast" primary={true} />
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
			</div>
		);
	}
}

export default App;
