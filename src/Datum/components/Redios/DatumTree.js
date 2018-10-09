import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DatumTree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {};
        this.parent = '';
    }

    static loop (data = []) {
        return data.map(item => {
            if (item.children && item.children.length) {
                this.parent = item.name;
                return (
                    <TreeNode
                        key={JSON.stringify(item)}
                        title={item.name}
                        selectable={false}
                    >
                        {DatumTree.loop(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={JSON.stringify(item)}
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
