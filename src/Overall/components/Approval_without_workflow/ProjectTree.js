import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { Tree, } from 'antd';

const TreeNode = Tree.TreeNode;

class ProjectTree extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			selectedUnit: [],
		}
	}

	componentDidMount() {
		const { actions: { getUnitTree } } = this.props;
		getUnitTree();
	}

	onSelectUnit(value) {
		const { actions: { setSelectedUnit, getBlockIndex,toggleBlockInfo } } = this.props;

		toggleBlockInfo('close');

		const code = value[0] && value[0].split('--')[0];
		const type = value[0] && value[0].split('--')[1];

		if (type === 'C_WP_UNT') {
			console.log('i!am!coming!');
			getBlockIndex({ code });			
		}

		console.log('Tree-onselect-value',value);
		setSelectedUnit(value);
	}

	render() {
		const { unitTree = [], selectedUnit = [] } = this.props;

		return (
			<Tree className='global-tree-list' showLine defaultExpandAll={true}
				selectedKeys={selectedUnit} onSelect={this.onSelectUnit.bind(this)}>
				{
					ProjectTree.loop(unitTree)
				}
			</Tree>
		);
	};

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
						title={item.name}>
						{
							ProjectTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
				title={item.name} />;
		});
	};
}

export default ProjectTree;
