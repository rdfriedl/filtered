///<reference path="../typings/tsd.d.ts"/>

// polyfills
import 'script!es6-shim';
import 'script!angular2/bundles/angular2-polyfills';

//vender lib (defined in the global scope)
import 'reflect-metadata';
import 'rxjs';
import 'script!jquery';
import 'script!jquery.mousewheel';
import 'script!jquery.transit';
import 'script!svg.js';
import 'script!svg.filter.js';
import 'imports?this=>window!bootstrap';
import 'imports?this=>window!script!jsplumb/dist/js/jsPlumb-1.7.9.js';
import {enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

//src
import AppComponent from './components/app.component';

//start
enableProdMode();
bootstrap(AppComponent);
//css
import 'jsplumb/dist/css/jsplumb.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/superhero/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './css/theme.css';
import './css/util.css';
