import EffectManager, {InputEffect,OutputEffect,Effect,MultiEffect} from './effectManager.js';
import * as styles from './jsplumbStyles.js';
import page from './page.js';

export default class Editor{
	static get inst(){
		return this._instance || (this._instance = new Editor());
	}

	init(el){
		//create filter
		this.filter = new SVG.Filter();

	    var desc = document.createElement('desc');
	    desc.textContent = 'Created with Filtered | http://rdfriedl.github.io/filtered';
	    this.filter.node.appendChild(desc);

	    //get element
		this.element = el;

		//create jsplumb
	    this.editor = jsPlumb.getInstance({
	        // default drag options
	        DragOptions: { cursor: 'pointer', zIndex: 2000 },
	        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
	        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
	        ConnectionOverlays: [
	            [ "Arrow", { location: 1 } ]
	        ],
	        Container: "editor"
	    });

	    // make all the effect divs draggable
   		this.editor.draggable(jsPlumb.getSelector("#editor .effect"));

   		this._bindEvents();

   		//patch
   		window.editor = this.editor;
   		window.filter = this.filter;

	    //create input and output effects
	    this.inputEffect = new InputEffect();
	    this.outputEffect = new OutputEffect();
	}

	effects = []

	_bindEvents(){
	    this.editor.bind('connection',function(info){
	        if(info.targetEndpoint.getParameter('this') instanceof inputs.EffectInput){
	            info.targetEndpoint.getParameter('this').connectionEvent(info.sourceEndpoint.getParameter('this'));
	        }
	        page.editor.arange();
	        page.filters.saved(false);
	    });

	    this.editor.bind('connectionDetached',function(info){
	        if(info.targetEndpoint.getParameter('this') instanceof inputs.EffectInput){
	            info.targetEndpoint.getParameter('this').connectionDetachedEvent();
	        }
	        page.editor.arange();
	        page.filters.saved(false);
	    });

	    this.editor.bind('connectionMoved',function(info){
	        if(info.originalTargetEndpoint.getParameter('this') instanceof inputs.EffectInput){
	            info.originalTargetEndpoint.getParameter('this').connectionDetachedEvent();
	        }
	        if(info.newTargetEndpoint.getParameter('this') instanceof inputs.EffectInput){
	            info.newTargetEndpoint.getParameter('this').connectionDetachedEvent(info.newSourceEndpoint.getParameter('this'));
	        }
	        // page.editor.arange(); dont need to arange
	        page.filters.saved(false);
	    });

	    this.editor.repaintEverything();
	}

	add(effect){
		if(!(effect instanceof Effect)) return;
		this.effects.push(effect);
	}
}
