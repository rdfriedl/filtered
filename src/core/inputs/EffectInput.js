import Input from '../Input.js';
import EffectOutput from '../outputs/EffectOutput';

export default class EffectInput extends Input{
	acceptConnection(output){
		return output instanceof EffectOutput;
	}
}
