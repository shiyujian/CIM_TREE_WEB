import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export default class SimpleTree extends Component {
    static propTypes = {
        dataSource: PropTypes.array,
        selectedKey: PropTypes.string,
        onSelect: PropTypes.func
    };

    static loop (data = []) {
        return data.map(item => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode key={`${item.code}`} title={item.name}>
                        {SimpleTree.loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={`${item.code}`} title={item.name} />;
        });
    }

    render () {
        const { dataSource = [], selectedKey, onSelect } = this.props;
        return (
            <Tree showLine selectedKeys={[selectedKey]} onSelect={onSelect}>
                {SimpleTree.loop(dataSource)}
            </Tree>
        );
    }
}
