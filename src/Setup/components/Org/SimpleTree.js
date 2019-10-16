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

    // static loop (data = []) {
    //     return data.map(item => {
    //         if (item.children && item.children.length) {
    //             return (
    //                 <TreeNode key={`${item.code}`} title={item.name}>
    //                     {SimpleTree.loop(item.children)}
    //                 </TreeNode>
    //             );
    //         }
    //         return <TreeNode key={`${item.code}`} title={item.name} />;
    //     });
    // }
    static loop (data = [], arr = []) {
        return data.map(item => {
            if (item && item.OrgCode) {
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.OrgName}`}
                        >
                            {SimpleTree.loop(item.children)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.OrgName}`}
                        />
                    );
                }
            } else {
                if (item && item.Orgs && item.Orgs.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.ProjectName}`}
                        >
                            {SimpleTree.loop(item.Orgs)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.ProjectName}`}
                        />
                    );
                }
            }
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
