import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {
    static propTypes = {};

    static loop (data = [], time = 0) {
        if (data && data instanceof Array) {
            return data.map((item, index) => {
                if (item.children) {
                    return (
                        <TreeNode
                            disabled
                            key={item.ID}
                            title={item.OrgName}>
                            {PkCodeTree.loop(item.children, time + 1)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.ID} title={item.OrgName} />;
            });
        } else {
            return <TreeNode key={data.ID} title={data.OrgName} />;
        }
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
