import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

export default class WorkPackageTree extends Component {

	static propTypes = {};

	static loop(data = [], key = '') {
		return data.map((item, index) => {
			let innerKey = `${index}`;
			const children = item.children || [];
			if (key) {
				innerKey = `${key}-${index}`;
			}
			if (children.length) {
				return (
					<TreeNode key={`${item.code}~${item.obj_type}`}
							  className="ant-tree-title-edit"
							  title={item.name}>
						{
							WorkPackageTree.loop(children, innerKey)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}~${item.obj_type}`}
							 className="ant-tree-title-edit"
							 title={item.name}/>;
		});
	};

	render() {
		const {treeData = [], currentNode} = this.props;
		return (
			<Tree showLine defaultExpandAll={true}
				  selectedKeys={[this.props.selectedKeys]}
				  onSelect={this.props.onSelect}>
				{
					WorkPackageTree.loop(treeData)
				}
			</Tree>
		);
	}

}
