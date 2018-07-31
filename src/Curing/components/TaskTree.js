import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class TaskTree extends Component {
    constructor (props) {
        super(props);
        this.originOnCheck = this.props.onCheck;
        this.originOnSelect = this.props.onSelect;
        this.state = {
            checkkeys: []
        };
    }

    onCheck (keys, info) {
        this.originOnCheck(keys, info);
    }

    onSelect (keys, info) {
        console.log('sssssssssssssssss');
        this.originOnSelect(keys, info);
    }

    loop (p, loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime === 1) {
            if (p) {
                return (
                    <TreeNode
                        selectable={false}
                        title={p.Name}
                        key={p.ID}
                    >
                        {p.children &&
                            p.children.map(m => {
                                return that.loop(m, loopTime);
                            })}
                    </TreeNode>
                );
            }
        } else {
            if (p) {
                return (
                    <TreeNode
                        title={`${p.CreateTime}-${p.CuringMans}`}
                        key={p.ID}
                    />
                );
            }
        }
    }

    render () {
        let { content = [] } = this.props;
        const that = this;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element != undefined) {
                contents.push(element);
            }
        }
        return (
            <div>
                <Tree
                    // checkable
                    // showIcon
                    // checkedKeys={this.state.checkkeys}
                    onCheck={this.onCheck.bind(that)}
                    showLine
                    onSelect={this.onSelect.bind(this)}
                    defaultExpandAll
                >
                    {contents.map(p => {
                        return that.loop(p);
                    })}
                </Tree>

            </div>
        );
    }
}