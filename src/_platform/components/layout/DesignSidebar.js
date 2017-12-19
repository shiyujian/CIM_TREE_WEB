/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, {PropTypes} from 'react';


const styles = {
	position: 'absolute',
	width: 240,
	height: '100%',
	marginLeft: '-240px',
	background:'#f5f5f5',
	overflowY: 'auto',
    overflowX: 'hidden'
}
export const DesignSidebar = ({children}) => {
	return (
		<div style={styles}>
			{children}
		</div>
	);
};

DesignSidebar.propTypes = {};
DesignSidebar.defaultProps = {};

export default DesignSidebar;
