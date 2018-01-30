import React, {Component} from 'react';
import {Tree,Spin} from 'antd';
const TreeNode = Tree.TreeNode;

export default class WorkTree extends Component {

	static propTypes = {};

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.pk}--${item.code}--children`}
					          title={item.name}>
						{
							WorkTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.pk}--${item.code}--${item.obj_type_hum}`}
			                 title={item.name}/>;
		});
	};

	render() {
		const {treeData = []} = this.props;
		return (
            <Spin tip="加载中" spinning={this.props.loading}>
                <div>
                    {treeData.length ?
                        <Tree showLine
                            selectedKeys={[this.props.selectedKeys]}
                            defaultExpandAll={true}
                            onSelect={this.props.onSelect}>
                            {
                                WorkTree.loop(treeData)
                            }
                        </Tree>
                        : ''
                    }
                </div>
            </Spin>
		);
	}
}