import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree,message} from 'antd';

const TreeNode = Tree.TreeNode;

export default class ItmTree extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};

	onSelect(code_type) {
		// console.log('选择的分项',code_type)
		if (code_type.length > 0) {
			const {actions: {setSelectedItm}} = this.props;
			setSelectedItm(code_type[0])
		}
	}

	render() {
		const {itmTreeData = [], selectedItm,selectedPtr} = this.props;
		return (
			<Tree className='global-tree-list' showLine defaultExpandAll={true}
				  selectedKeys={[selectedItm]} onSelect={this.onSelect.bind(this)}>
				{
					selectedPtr !== undefined ? ItmTree.loop(itmTreeData.filter(f => f.parent.code === selectedPtr.split('--')[0])) : null
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
							ItmTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							 title={item.name}/>;
		});
	};
}
