import React from 'react';
import {observer} from 'mobx-react';
import InputType from 'core/inputs/NumberInput';

const NumberInput = observer(({input}) => (
	<div className="input-group input-group-sm">
		<input
			type="number"
			className="form-control mr-2"
			value={input.value}
			disabled={!!input.connection}
			onChange={e => input.defaultValue = input.allowFloat? parseFloat(e.target.value) : parseInt(e.target.value, 10)}
			min={input.min}
			max={input.max}
			step={input.step}
		/>
		<label className="mr-3">{input.name}</label>
	</div>
));

NumberInput.PropTypes = {
	input: React.PropTypes.instanceOf(InputType).isRequired
}

export {NumberInput as default};
