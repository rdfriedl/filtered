import ko from 'knockout';

export function observable(){
	var val = Array.prototype.shift.call(arguments);
	var o = val instanceof Array? ko['observableArray'](val) : ko['observable'](val);

	for(var i = 0; i < arguments.length; i++){
		o.subscribe(arguments[i]);
	}
	return o;
}
