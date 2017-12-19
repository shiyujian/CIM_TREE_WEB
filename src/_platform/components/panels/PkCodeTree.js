import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;
export default class PkCodeTree extends Component {

	static propTypes = {};

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.pk}--${item.code}--children`}
					          title={item.name}>
						{
							PkCodeTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.pk}--${item.code}--parent`}
			                 title={item.name}/>;
		});
	};

	render() {
		const {treeData = []} = this.props;
		return (
			<Tree
				selectedKeys={[this.props.selectedKeys]}
				onSelect={this.props.onSelect}>
				{
					PkCodeTree.loop(treeData)
				}
			</Tree>
		);
	}
}
