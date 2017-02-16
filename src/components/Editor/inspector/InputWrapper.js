import React from 'react';

var InputWrapper = ({children, ...props}) => (
	<div className="row mb-1" {...props}>
		<div className="col-12">
			{React.Children.toArray(children)}
		</div>
	</div>
);

export {InputWrapper as default};
