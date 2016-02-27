//vender lib (defined in the global scope)
import 'reflect-metadata';
import 'rxjs';
import 'script!jquery';
import 'script!jquery.mousewheel';
import 'script!jquery.transit';
import 'imports?this=>window!bootstrap';
import jsplumb from 'imports?this=>window!script!jsplumb/dist/js/jsPlumb-1.7.9.js';

//src
import './js/main.js';
import './js/editPosition.js';
import './js/page.js';

//css
import 'style!jsplumb/dist/css/jsplumb.css';
import 'style!bootstrap/dist/css/bootstrap.css';
import 'style!bootswatch/superhero/bootstrap.css';
import 'style!font-awesome/css/font-awesome.css';
import 'style!./css/prettify.css';
import 'style!./css/style.css';
