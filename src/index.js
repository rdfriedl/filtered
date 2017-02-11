import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import 'font-awesome/css/font-awesome.min.css';
import 'flex-layout-attribute';
import './index.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components/App/';
import Edit from './components/Edit';

import 'core/Node';

// fix tab events
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render((
	<MuiThemeProvider>
		<Router history={browserHistory}>
			<Route path="/" component={App}></Route>
			<Route path="/edit" component={Edit}></Route>
		</Router>
	</MuiThemeProvider>
	),
	document.getElementById('root')
);
