import React, { Component } from 'react';
import { Tree } from 'antd';
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
        const { treeData = [] } = this.props;
        return (
            <div>
                {treeData.length ? (
                    <Tree
                        showLine
                        checkable
                        onCheck={this.onCheck.bind(this)}
                    >
                        {treeData.map(p => {
                            return this.loop(p);
                        })}
                    </Tree>
                ) : (
                    ''
                )}
            </div>
        );
    }
}
