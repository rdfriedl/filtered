import {Injectable} from 'angular2/core';

import Effect from '../effects/effect';
import MultiEffect from '../effects/multiEffect';
import InputEffect from '../effects/inputEffect';
import OutputEffect from '../effects/outputEffect';

@Injectable()
export default class FilterService{
	constructor(){}

    private _filter: svgjs.Filter = new SVG.Filter;
	private previewEffect: Effect;

	public get filter():svgjs.Filter{
		return this._filter;
	}

	setPreviewEffect(effect:Effect){
		if(effect instanceof Effect) this.previewEffect = effect;
	}
	getPreviewEffect():Effect{
		return this.previewEffect
	}
	resetPreview():void{
		this.previewEffect = undefined;
	}

	toXML():string{return this.filter.node.innerHTML;}
	toJSON():any{}

	fromXML():boolean{
		return true;
	}
	fromJSON():boolean{
		return true;
	}
}
