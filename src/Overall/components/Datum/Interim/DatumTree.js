import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DatumTree extends Component {
    static loop (data = []) {
        return data.map(item => {
            if (item.Children && item.Children.length) {
                return (
                    <TreeNode
                        key={`${item.ID}`}
                        title={item.DirName}
                    >
                        {DatumTree.loop(item.Children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={`${item.ID}`}
                    title={item.DirName}
                />
            );
        });
    }

    render () {
        const {
            treeData = [],
            loading = false
        } = this.props;
        return (
            <Spin tip='加载中' spinning={loading}>
                <div>
                    {treeData.length ? (
                        <Tree
                            selectedKeys={[this.props.selectedKeys]}
                            defaultExpandAll
                            onSelect={this.props.onSelect}
                        >
                            {DatumTree.loop(treeData)}
                        </Tree>
                    ) : (
                        ''
                    )}
                </div>
            </Spin>
        );
    }
}
