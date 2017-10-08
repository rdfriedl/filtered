import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import HomeView from './views/Home';
import EditorView from './views/Editor';
import Navbar from './Navbar';

const Router = () => (
	<BrowserRouter>
		<div>
			<Navbar/>
			<Route path="/" component={HomeView} exact/>
			<Route path="/editor" component={EditorView}/>
		</div>
	</BrowserRouter>
);

export default Router;