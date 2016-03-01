//vender lib (defined in the global scope)
import 'reflect-metadata';
import 'rxjs';
import 'script!jquery';
import 'script!jquery.mousewheel';
import 'script!jquery.transit';
import 'imports?this=>window!bootstrap';
import jsplumb from 'imports?this=>window!script!jsplumb/dist/js/jsPlumb-1.7.9.js';
import {bootstrap} from 'angular2/platform/browser';

//src
// import './js/main.js';
// import './js/editPosition.js';
// import './js/page.js';
import AppComponent from './js/components/app.component.js';

//start
bootstrap(AppComponent);

//css
import 'jsplumb/dist/css/jsplumb.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/cosmo/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
// import 'style!./css/style.css';
