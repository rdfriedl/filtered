import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import OutputType from 'core/outputs/NumberOutput';

const NumberOutput = observer(({output}) => (
	<p className="m-0 text-right">{output.name}: {output.value}</p>
));

NumberOutput.PropTypes = {
	output: PropTypes.instanceOf(OutputType).isRequired
};

export {NumberOutput as default};
