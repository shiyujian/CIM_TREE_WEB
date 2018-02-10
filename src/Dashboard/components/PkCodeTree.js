import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {

	static propTypes = {};

	static loop(data = []) {
		return data.map((item,index) => {
			if (item.children) {
				return (
					<TreeNode key={item.No}
					          title={item.Name}>
						{
							PkCodeTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={item.No}
			                 title={item.Name}/>;
		});
	};

	render() {
		const {treeData = []} = this.props;
		console.log(treeData);
		return (
			<div>
				{treeData.length?
					<Tree showLine
					      selectedKeys={[this.props.selectedKeys]}
					      defaultExpandAll={true}
					      autoExpandParent ={true}
					      onSelect={this.props.onSelect}
                          showIcon={true}
					>
						{
							PkCodeTree.loop(treeData)
						}
					</Tree>
					:''
				}
			</div>
		);
	}
}
