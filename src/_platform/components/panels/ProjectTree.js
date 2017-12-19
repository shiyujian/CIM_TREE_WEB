import React, {PropTypes, Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

export default class ProjectTree extends Component {

	static propTypes = {};

	constructor(props){
		super(props);
	}


	static loop(data = [], key = '') {
		return data.map((item, index) => {
			let innerKey = `${index}`;
			if (key) {
				innerKey = `${key}-${index}`;
			}
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.pk}--${innerKey}`}
							  title={item.name}>
						{
							ProjectTree.loop(item.children, innerKey)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.pk}--${innerKey}`} title={item.name}/>;
		});
	};

	render() {
		const { 
			treeData = [],
			currentNode,
			treeSelect
		} = this.props;
		let defaultExpandedKeys = [];
		for(let i = 0;i < treeData.length;i++){
			if(treeData[i].name.indexOf("18号线") != -1){
				defaultExpandedKeys.push(treeData[i].pk + "--" + i);
				let children = treeData[i].children;
				for(let j = 0;j < children.length;j++){
					defaultExpandedKeys.push(children[j].pk + "--" + i + "-" + j);
				}
			}
		}
		if(defaultExpandedKeys.length > 0){
			return (
				<Tree showLine onSelect={treeSelect} defaultExpandedKeys={defaultExpandedKeys}>
					{
						ProjectTree.loop(treeData)
					}
				</Tree>
			);
		}else{
			return (
				null
			);
		}

	}
}
