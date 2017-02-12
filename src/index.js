import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

// import css
import './utils.css';
import './index.css';

// import bootstrap
import 'imports-loader?jQuery=jquery&Tether=tether!bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'font-awesome/css/font-awesome.min.css';

import App from './components/App';
import Editor from './components/Editor';

import 'core/Node';

// fix tab events
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={App}></Route>
		<Route path="/editor" component={Editor}></Route>
	</Router>
	),
	document.getElementById('root')
);
