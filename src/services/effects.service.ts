import {Injectable} from 'angular2/core';

import Effect from '../effects/effect.js';
import MultiEffect from '../effects/multiEffect.js';
import InputEffect from '../effects/inputEffect.js';
import OutputEffect from '../effects/outputEffect.js';

@Injectable()
export default class EffectsService{
	constructor(){}

	getEffects(){
		return Promise.resolve(Effects);
	}

	getEffectsByName(){
		return this.getEffects().then(effects => {
			let _effects = {};
			for(let effect of effects){
				_effects[effect.name] = effect;
			}
			return _effects;
		})
	}

	getBaseEffects(){
		return this.getEffects().then(effects => {
			let _effects = [];
			for(let i of effects){
				if(i.prototype.__proto__ !== MultiEffect.prototype) _effects.push(i);
			}

			return _effects;
		})
	}

	getBaseEffectsByName(){
		return this.getBaseEffects().then(effects => {
			let _effects = {};
			for(let effect of effects){
				_effects[effect.name] = effect;
			}
			return _effects;
		})
	}

	getPrebuiltEffects(){
		return this.getEffects().then(effects => {
			let _effects = [];
			for(let i of effects){
				if(i.prototype.__proto__ === MultiEffect.prototype) _effects.push(i);
			}

			return _effects;
		})
	}

	getPrebuiltEffectsByName(){
		return this.getPrebuiltEffects().then(effects => {
			let _effects = {};
			for(let effect of effects){
				_effects[effect.name] = effect;
			}
			return _effects;
		})
	}
}

var Effects = [];

//base effects
Effects.push(require('../effects/base/blend.js').default);
Effects.push(require('../effects/base/colorMatrix.js').default);
Effects.push(require('../effects/base/componentTransfer.js').default);
Effects.push(require('../effects/base/composite.js').default);
Effects.push(require('../effects/base/convolveMatrix.js').default);
Effects.push(require('../effects/base/deffuseLighting.js').default);
Effects.push(require('../effects/base/displacementMap.js').default);
Effects.push(require('../effects/base/flood.js').default);
Effects.push(require('../effects/base/gaussianBlur.js').default);
Effects.push(require('../effects/base/image.js').default);
Effects.push(require('../effects/base/merge.js').default);
Effects.push(require('../effects/base/morphology.js').default);
Effects.push(require('../effects/base/offset.js').default);
Effects.push(require('../effects/base/specularLighting.js').default);
Effects.push(require('../effects/base/tile.js').default);
Effects.push(require('../effects/base/turbulence.js').default);

//prebuilt effects
Effects.push(require('../effects/prebuilt/bump.js').default);
Effects.push(require('../effects/prebuilt/greyScale.js').default);
Effects.push(require('../effects/prebuilt/hueRotate.js').default);
Effects.push(require('../effects/prebuilt/recolor.js').default);
Effects.push(require('../effects/prebuilt/sepiatone.js').default);
Effects.push(require('../effects/prebuilt/shadow.js').default);
Effects.push(require('../effects/prebuilt/stroke.js').default);

export {InputEffect};
export {OutputEffect};
export {Effect};
export {MultiEffect};
