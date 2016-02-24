import Effect from './effects/effect.js';
import MultiEffect from './effects/multiEffect.js';
import InputEffect from './effects/inputEffect.js';
import OutputEffect from './effects/outputEffect.js';

export default class EffectManager{
	constructor(){
		this._effects = {};
	}

	static get instance(){
		return this._instance || (this._instance = new EffectManager());
	}

	add(url){
		var effect = require(url).default;
		this._effects[effect.name] = effect;
		return this;
	}

	get effects(){
		return this._effects;
	}
}

export {InputEffect};
export {OutputEffect};

//base effects
EffectManager.instance
	.add('./effects/base/blend.js')
	.add('./effects/base/colorMatrix.js')
	.add('./effects/base/componentTransfer.js')
	.add('./effects/base/composite.js')
	.add('./effects/base/convolveMatrix.js')
	.add('./effects/base/deffuseLighting.js')
	.add('./effects/base/displacementMap.js')
	.add('./effects/base/flood.js')
	.add('./effects/base/gaussianBlur.js')
	.add('./effects/base/image.js')
	.add('./effects/base/merge.js')
	.add('./effects/base/morphology.js')
	.add('./effects/base/offset.js')
	.add('./effects/base/specularLighting.js')
	.add('./effects/base/tile.js')
	.add('./effects/base/turbulence.js');

//prebuilt effects
EffectManager.instance
	.add('./effects/prebuilt/bump.js')
	.add('./effects/prebuilt/greyScale.js')
	.add('./effects/prebuilt/hueRotate.js')
	.add('./effects/prebuilt/recolor.js')
	.add('./effects/prebuilt/sepiatone.js')
	.add('./effects/prebuilt/shadow.js')
	.add('./effects/prebuilt/stroke.js');
