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
            if (item && item.extra_params && item.extra_params.companyStatus) {
                if (item.extra_params.companyStatus.indexOf('单位') !== -1) {
                    companyStatus = true;
                } else if (item.extra_params.companyStatus === '非公司') {
                    companyStatus = false;
                }
                // 只分为项目和公司时
                if (item.extra_params.companyStatus === '公司') {
                    companyStatus = true;
                } else if (item.extra_params.companyStatus === '项目') {
                    companyStatus = false;
                }
            }
            if (item.children && item.children.length) {
                return (
                    <TreeNode
                        key={`${item.code}`}
                        disabled={!companyStatus}
                        title={item.name} >
                        {SimpleTree.loop(item.children, companyStatus)}
                    </TreeNode>
                );
            }
            return <TreeNode
                key={`${item.code}`}
                disabled={!companyStatus}
                title={item.name} />;
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
