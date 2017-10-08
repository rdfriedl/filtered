import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const InputWrapper = ({children, ...props}) => {
	let {isLast, isFirst, ...otherProps} = props;
	return (
		<div className={classnames({row: true, 'mb-1': !isLast, 'mt-1': !isFirst})} {...otherProps}>
			<div className="col-12">
				{React.Children.toArray(children)}
			</div>
		</div>
	);
};

InputWrapper.PropTypes = {
	isFirst: PropTypes.bool,
	isLast: PropTypes.bool
};

InputWrapper.defaultProps = {
	isFirst: false,
	isLast: false
};

export {InputWrapper as default};
