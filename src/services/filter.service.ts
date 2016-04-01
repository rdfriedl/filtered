import {Injectable} from 'angular2/core';

@Injectable()
export default class FilterService{
	constructor(){}

    private _filter: svgjs.Filter = new SVG.Filter;

	public get filter():svgjs.Filter{
		return this._filter;
	}
}
