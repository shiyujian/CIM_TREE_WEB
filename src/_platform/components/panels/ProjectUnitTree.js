import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree} from 'antd';
import './Tree.less';

const TreeNode = Tree.TreeNode;

export default class ProjectUnitTree extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};

	render() {
		const {dataSource = [], selectedKey, onSelect} = this.props;
		return (
            <div>
                {dataSource.length?
        			<Tree className='global-tree-list' showLine
                        defaultExpandAll={true}
        			      selectedKeys={[selectedKey]} onSelect={onSelect}>
        				{
        					ProjectUnitTree.loop(dataSource)
        				}
        			</Tree>
                :''}
            </div>
		);
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.value}`}
					          title={item.label}>
						{
							ProjectUnitTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.value}`}
			                 title={item.label}/>;
		});
	};
}
