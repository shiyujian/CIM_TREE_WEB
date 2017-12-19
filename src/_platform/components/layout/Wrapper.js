import React from 'react';

export const Wrapper = ({children}) => {
	return (
		<div style={{height: '100%', overflowX: 'hidden'}}>
			{children}
		</div>
	);
};

Wrapper.propTypes = {};
Wrapper.defaultProps = {};

export default Wrapper
