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
    // 如果父级为公司，则可以呗选中，如果为项目，不能呗选中
    static loop (data = [], companyStatus = false) {
        return data.map(item => {
            if (item && item.OrgCode) {
                if (item.OrgType) {
                    if (item.OrgType.indexOf('单位') !== -1) {
                        companyStatus = true;
                    } else if (item.OrgType === '非公司') {
                        companyStatus = false;
                    }
                }
                if (item && item.OrgPK) {
                    companyStatus = true;
                }
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={`${JSON.stringify(item)}`}
                            disabled={!companyStatus}
                            title={`${item.OrgName}`}
                        >
                            {SimpleTree.loop(item.children, companyStatus)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${JSON.stringify(item)}`}
                            disabled={!companyStatus}
                            title={`${item.OrgName}`}
                        />
                    );
                }
            } else {
                companyStatus = false;
                if (item && item.Orgs && item.Orgs.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            disabled
                            title={`${item.ProjectName}`}
                        >
                            {SimpleTree.loop(item.Orgs, companyStatus)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            disabled
                            title={`${item.ProjectName}`}
                        />
                    );
                }
            }
        });
    }

    render () {
        const {
            dataSource = [],
            selectedKey,
            onSelect
        } = this.props;
        return (
            <Tree
                autoExpandParent
                showLine
                selectedKeys={[selectedKey]}
                onSelect={onSelect}>
                {SimpleTree.loop(dataSource)}
            </Tree>
        );
    }
}
