import React, {Component} from 'react';
import {Tree} from 'antd';

const TreeNode = Tree.TreeNode;

export default class CodeTree extends Component {

	render() {
		return (
			<Tree showLine>
				<TreeNode key="111" title="1111"/>
				<TreeNode key="222" title="2222"/>
				<TreeNode key="333" title="3333"/>
				<TreeNode key="444" title="4444"/>
				<TreeNode key="555" title="5555"/>
			</Tree>
		);
	}
}
