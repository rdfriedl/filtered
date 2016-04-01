import {Injectable} from 'angular2/core';

import Effect from '../effects/effect';
import MultiEffect from '../effects/multiEffect';
import InputEffect from '../effects/inputEffect';
import OutputEffect from '../effects/outputEffect';

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
// Effects.push(require('../effects/base/blend').default);
// Effects.push(require('../effects/base/colorMatrix').default);
// Effects.push(require('../effects/base/componentTransfer').default);
// Effects.push(require('../effects/base/composite').default);
// Effects.push(require('../effects/base/convolveMatrix').default);
// Effects.push(require('../effects/base/deffuseLighting').default);
// Effects.push(require('../effects/base/displacementMap').default);
// Effects.push(require('../effects/base/flood').default);
// Effects.push(require('../effects/base/gaussianBlur').default);
// Effects.push(require('../effects/base/image').default);
// Effects.push(require('../effects/base/merge').default);
// Effects.push(require('../effects/base/morphology').default);
// Effects.push(require('../effects/base/offset').default);
// Effects.push(require('../effects/base/specularLighting').default);
// Effects.push(require('../effects/base/tile').default);
// Effects.push(require('../effects/base/turbulence').default);

//prebuilt effects
// Effects.push(require('../effects/prebuilt/bump').default);
// Effects.push(require('../effects/prebuilt/greyScale').default);
// Effects.push(require('../effects/prebuilt/hueRotate').default);
// Effects.push(require('../effects/prebuilt/recolor').default);
// Effects.push(require('../effects/prebuilt/sepiatone').default);
// Effects.push(require('../effects/prebuilt/shadow').default);
// Effects.push(require('../effects/prebuilt/stroke').default);

export {InputEffect};
export {OutputEffect};
export {Effect};
export {MultiEffect};
