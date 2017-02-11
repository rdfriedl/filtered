import React from 'react';
import {observer} from 'mobx-react';

const NumberInput = observer(({input}) => (
	<input type="number" value={input.value} disabled={!!input.connection} onchange={e => input.value = e.target.value}/>
));

export {NumberInput as default};
