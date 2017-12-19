import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree} from 'antd';
import styles from './style.css';

const TreeNode = Tree.TreeNode;

export default class PanoramaManage extends Component {

	static propTypes = {
		// title: PropTypes.string.isRequired,
		// visible: PropTypes.bool.isRequired,
		// onOk: PropTypes.func.isRequired,
		// onCancel: PropTypes.func.isRequired,
		// initialData: PropTypes.object, // 默认值
		
	}

	state = {
		// picUrl: null,	
	}
		
	componentDidMount() {
		
	}
	
	render() {
		return (
			<div>
				<Tree>

				</Tree>
			</div>
		);
	}
}



