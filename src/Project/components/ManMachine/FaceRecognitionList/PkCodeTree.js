import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {
    static propTypes = {};

    static loop (data = []) {
        return data.map((item, index) => {
            return <TreeNode key={item.No} title={item.Name} />;
        });
    }

    render () {
        const { treeData = [] } = this.props;
        return (
            <div>
                <Tree
                    showLine
                    selectedKeys={[this.props.selectedKeys]}
                    defaultExpandAll
                    autoExpandParent
                    onSelect={this.props.onSelect}
                    onExpand={this.props.onExpand}
                >
                    {PkCodeTree.loop(treeData)}
                </Tree>
            </div>
        );
    }
}
