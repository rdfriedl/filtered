import Input from '../Input.js';
import NumberOutput from '../outputs/NumberOutput'

export default class NumberInput extends Input{
	defaultValue = 0;

	parseValue(value){
		// make sure the value is a number
		return parseFloat(value);
	}

	acceptConnection(output){
		return output instanceof NumberOutput;
	}
}
