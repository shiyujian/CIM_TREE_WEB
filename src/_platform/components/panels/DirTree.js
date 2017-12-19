import React, {PropTypes, Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;
export default class DirTree extends Component {

	static propTypes = {};

	static loop(data = [], key = '') {
		return data.map((item, index) => {
			let innerKey = `${index}`;
			if (key) {
				innerKey = `${key}-${index}`;
			}
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}`}
							  className="ant-tree-title-edit"
							  title={item.name}>
						{
							DirTree.loop(item.children, innerKey)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}`}
							 className="ant-tree-title-edit"
							 title={item.name}/>;
			// if (item.children && item.children.length) {
			// 	return (
			// 		<TreeNode key={`${item.code}--${innerKey}`}
			// 				  title={item.name}>
			// 			{
			// 				DirTree.loop(item.children, innerKey)
			// 			}
			// 		</TreeNode>
			// 	);
			// }
			// return <TreeNode key={`${item.code}--${innerKey}`} title={item.name}/>;
		});
	};

	render() {
		const {treeData = [], currentNode} = this.props;
		return (
			<Tree
				selectedKeys={[this.props.selectedKeys]}
				onSelect={this.props.onSelect}>
				{
					DirTree.loop(treeData)
				}
			</Tree>
		);
	}
}
