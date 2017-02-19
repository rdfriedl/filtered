import React from 'react';
import classnames from 'classnames';

var InputWrapper = ({children, ...props}) => {
	let {isLast, isFirst, ...otherProps} = props;
	return (
		<div className={classnames({row: true, 'mb-1': !isLast, 'mt-1': !isFirst})} {...otherProps}>
			<div className="col-12">
				{React.Children.toArray(children)}
			</div>
		</div>
	);
}

InputWrapper.PropTypes = {
	isFirst: React.PropTypes.bool,
	isLast: React.PropTypes.bool
}

InputWrapper.defaultProps = {
	isFirst: false,
	isLast: false
}

export {InputWrapper as default};
