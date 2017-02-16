import React from 'react';
import {observer} from 'mobx-react';
import OutputType from 'core/outputs/NumberOutput';

const NumberOutput = observer(({output}) => (
	<p className="m-0 text-right">{output.name}: {output.value}</p>
));

NumberOutput.PropTypes = {
	output: React.PropTypes.instanceOf(OutputType).isRequired
}

export {NumberOutput as default};
