import React from 'react';
import ReactDOM from 'react-dom';

// import css
import './utils.css';
import './index.css';

// import bootstrap
import 'imports-loader?jQuery=jquery&Tether=tether&Popper=popper.js!bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'font-awesome/css/font-awesome.min.css';

import Router from './components/Router';

// fix tab events
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// render the app
ReactDOM.render(
	<Router/>,
	document.getElementById('root')
);
