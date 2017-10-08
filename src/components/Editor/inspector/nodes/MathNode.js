import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import MathNode from 'core/nodes/MathNode';

import InputInspector from '../InputInspector';
import OutputInspector from '../OutputInspector';
import InputWrapper from '../InputWrapper';

let MathNodeInspector = observer(({node}) => (
	<div>
		<InputInspector input={node.ins.in1} />
		<InputInspector input={node.ins.in2} />
		<InputWrapper>
			<div className="input-group input-group-sm">
				<label className="mr-3">Operation</label>
				<select className="form-control" value={node.operation} onChange={e => node.operation = e.target.value}>
					<option value="add">Add</option>
					<option value="sub">Subtract</option>
					<option value="multiply">Multiply</option>
					<option value="divide">Divide</option>
				</select>
			</div>
		</InputWrapper>
		<OutputInspector output={node.outs.out}/>
	</div>
));

MathNodeInspector.PropTypes = {
	node: PropTypes.instanceOf(MathNode).isRequired
};

export {MathNodeInspector as default};
