import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components/App/';

import 'core/Node';

// fix tab events
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
	(
		<MuiThemeProvider>
			<App />
		</MuiThemeProvider>
	),
	document.getElementById('root')
);
