import React, { Component } from 'react';
import { Tree, Spin } from 'antd';

const TreeNode = Tree.TreeNode;

export default class ThinClassTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
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
                    disabled={!disableCheckbox}
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
            loading = false
        } = this.props;
        return (
            <div>
                <Spin spinning={loading}>
                    <Tree
                        onSelect={this.props.onSelect}
                    >
                        {
                            treeData.map(p => {
                                return this.loop(p);
                            })
                        }
                    </Tree>
                </Spin>
            </div>

        );
    }
}
