import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {
    static propTypes = {};

    loop (data = [], loopTime) {
        const that = this;
        let disableCheckbox = true;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime <= 3) {
            disableCheckbox = false;
        }
        if (data) {
            return (
                <TreeNode
                    title={data.Name}
                    key={data.No}
                    selectable={disableCheckbox}
                >
                    {data.children &&
                        data.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    render () {
        const {
            treeData = [],
            areaTreeLoading
        } = this.props;
        console.log('areaTreeLoading', areaTreeLoading);
        return (
            <div>
                <Spin spinning={areaTreeLoading}>
                    <Tree
                        showLine
                        onSelect={this.props.onSelect}
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
