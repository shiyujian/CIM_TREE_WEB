import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;
import styles from './index.css';
export default class DashTree extends Component {

	static propTypes = {};
	static expands=[];
	static loop(data = []) {
		return data.map((item, index) => {
			const {properties = {}, geometry = {}} = item;
			if (item.children && item.children.length) {
				DashTree.expands.push(`${item.name}--${index}--parent`)
				return (
					<TreeNode key={`${item.name}--${index}--parent`}
							  className={styles['ant-tree-title-edit']}
							  title={item.name}>
						{
							DashTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode
				key={`${properties.name}--${index}--children--${geometry.coordinates}--${properties.type}`}
				className={styles['ant-tree-title-edit']}
				title={properties.name}/>;
		});
	};

	render() {
		const {treeData = []} = this.props;
		return (
			<Tree defaultExpandedKeys={DashTree.expands}
				onSelect={this.props.onSelect}>
				{
					DashTree.loop(treeData)
				}
			</Tree>
		);
	}
}
