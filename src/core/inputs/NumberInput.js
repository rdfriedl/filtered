import Input from '../Input.js';
import NumberOutput from '../outputs/NumberOutput'

export default class NumberInput extends Input{
	min = -Infinity;
	max = Infinity;
	allowFloat = true;
	step = 1;
	defaultValue = 0;

	parseValue(value){
		// make sure the value is a number
		value = this.allowFloat? parseFloat(value) : parseInt(value, 10);
		value = Math.min(value, this.max);
		value = Math.max(value, this.min);
		// value = Math.round(value / this.step) * this.step;
		return value;
	}

	acceptConnection(output){
		return output instanceof NumberOutput;
	}
}

