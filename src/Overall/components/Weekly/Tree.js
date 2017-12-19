import React, {Component} from 'react';
import {Tree} from 'antd';

const TreeNode = Tree.TreeNode;

export default class WeeklyList extends Component {

	static propTypes = {};
	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
				  <TreeNode key={`${item.name}--${item.code}--children`}
							title={item.name}>
					  {
						  WeeklyList.loop(item.children)
					  }
				  </TreeNode>
				);
			}
			return <TreeNode key={`${item.name}--${item.code}--parent`}
							 title={item.name}/>;
		});
	};
	render() {
		const treeData=this.props.timeLines;
		return (
		<Tree showLine expandedKeys={(treeData.length > 0) ? [`${treeData[0].name}--${treeData[0].code}--children`] : []}
		  selectedKeys={this.props.selectedKeys}
		  onSelect={this.props.onSelect}>
			{
				WeeklyList.loop(treeData)
			}
		</Tree>
		);
	}
}


