import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import OutputType from 'core/outputs/EffectOutput';

const EffectOutput = observer(({output}) => (
	<p className="m-0 text-right">{output.name}</p>
));

EffectOutput.PropTypes = {
	output: PropTypes.instanceOf(OutputType).isRequired
};

export {EffectOutput as default};
