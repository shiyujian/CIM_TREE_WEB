import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

export default class WorkTree extends Component {
    static propTypes = {};

    static loop (data = [], loopnum = 1) {
        return data.map(item => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode
                        key={`${item.pk}--${item.code}--${loopnum}`}
                        data={item}
                        title={item.name}
                    >
                        {WorkTree.loop(item.children, loopnum + 1)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={`${item.pk}--${item.code}--${loopnum}`}
                    data={item}
                    title={item.name}
                />
            );
        });
    }

    render () {
        const { treeData = [] } = this.props;
        return (
            <Spin tip='加载中' spinning={this.props.loading}>
                <div>
                    {treeData.length ? (
                        <Tree
                            showLine
                            selectedKeys={[this.props.selectedKeys]}
                            defaultExpandAll
                            onSelect={this.props.onSelect}
                        >
                            {WorkTree.loop(treeData)}
                        </Tree>
                    ) : (
                        ''
                    )}
                </div>
            </Spin>
        );
    }
}
