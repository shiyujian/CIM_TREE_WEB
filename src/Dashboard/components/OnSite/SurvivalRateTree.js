import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

export default class SurvivalRateTree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.originOnCheck = this.props.onCheck;
    }

    loop (data = [], loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (data) {
            return (
                <TreeNode
                    title={data.Name}
                    key={data.No}
                    selectable={false}
                >
                    {data.children &&
                        data.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    onCheck (keys, info) {
        this.originOnCheck(keys, info);
    }

    render () {
        const {
            survivalRateTree = [],
            survivalRateTreeLoading
        } = this.props;
        let treeData = [
            {
                Name: '全部',
                No: '全部',
                children: survivalRateTree
            }
        ];
        return (
            <div>
                <Spin spinning={survivalRateTreeLoading}>
                    <Tree
                        showLine
                        checkable
                        defaultCheckedKeys={['全部']}
                        onCheck={this.onCheck.bind(this)}
                    >
                        {treeData.map(p => {
                            return this.loop(p);
                        })}
                    </Tree>
                </Spin>
            </div>
        );
    }
}
