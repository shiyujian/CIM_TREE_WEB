import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class ThinClassTree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.originOnSelect = this.props.onSelect;
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

    onSelect (keys, info) {
        this.originOnSelect(keys, info);
    }

    render () {
        const { treeData = [] } = this.props;
        return (
            <div>
                {treeData.length ? (
                    <Tree
                        showLine
                        onSelect={this.onSelect.bind(this)}
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
