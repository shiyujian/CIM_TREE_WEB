import React, { Component } from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {
    static loop (data = [], arr = []) {
        return data.map(item => {
            if (item && item.OrgCode) {
                let companyStatus = false;
                if (item.OrgType) {
                    if (item.OrgType.indexOf('单位') !== -1) {
                        companyStatus = true;
                    } else if (item.OrgType === '非公司') {
                        companyStatus = false;
                    }
                }
                if (companyStatus) {
                    return (
                        <TreeNode
                            value={JSON.stringify(item)}
                            key={`${item.ID}`}
                            title={`${item.OrgName}`}
                        />
                    );
                } else if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.OrgName}`}
                            disabled
                        >
                            {PkCodeTree.loop(item.children)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.OrgName}`}
                            disabled
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
                            disabled
                        >
                            {PkCodeTree.loop(item.Orgs)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            title={`${item.ProjectName}`}
                            disabled
                        />
                    );
                }
            }
        });
    }

    render () {
        const {
            platform: {
                org = []
            },
            onSelect
        } = this.props;
        return (
            <Tree
                selectedKeys={[this.props.selectedKeys]}
                onSelect={onSelect}
                showLine>
                {PkCodeTree.loop(org)}
            </Tree>
        );
    }
}
