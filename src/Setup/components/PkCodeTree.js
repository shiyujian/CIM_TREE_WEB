import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {

	static propTypes = {};

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.pk}--${item.code}--children`} data={data}
					          title={item.name}>
						{
							PkCodeTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.pk}--${item.code}--${item.obj_type_hum}`} data={data}
			                 title={item.name}/>;
		});
	};

	render() {
		const {treeData = []} = this.props;
	    // console.log(this.props.onSelect)
		return (
            <div>
                {treeData.length?
        			<Tree showLine
        			      selectedKeys={[this.props.selectedKeys]}
                          defaultExpandAll={false}
        			      onSelect={this.props.onSelect}>
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
