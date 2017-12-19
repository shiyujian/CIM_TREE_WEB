import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree} from 'antd';

const TreeNode = Tree.TreeNode;

export default class PtrTree extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};

	//选择分部或者子分部
	onSelect(code_type) {
		// console.log(code_type)
		if (code_type.length > 0) {
			const {actions: {setSelectedPtr}} = this.props;
			setSelectedPtr(code_type[0]);
		}
	}

	render() {
		const {ptrTreeData = [], selectedPtr} = this.props;
		return (
			<Tree className='global-tree-list' showLine defaultExpandAll={true}
				  selectedKeys={[selectedPtr]} onSelect={this.onSelect.bind(this)}>
				{
					PtrTree.loop(ptrTreeData)
				}
			</Tree>
		);
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							  title={item.name}>
						{
							PtrTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							 title={item.name}/>;
		});
	};
}
