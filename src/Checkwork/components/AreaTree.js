import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class AreaTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    onCheck (keys, info) {
        this.props.onCheck(keys, info);
    }

    loop (p, loopTime) {
        const that = this;
        let disableCheckbox = false;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime <= 2) {
            disableCheckbox = true;
        }
        if (p) {
            return (
                <TreeNode
                    title={p.Name ? p.Name : p.name}
                    key={p.No ? p.No : p.id}
                    disableCheckbox={disableCheckbox}
                    selectable={false}
                >
                    {p.children &&
                        p.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    render () {
        let { content = [] } = this.props;
        const that = this;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element !== undefined) {
                contents.push(element);
            }
        }
        return (
            <div>
                <Tree
                    checkable
                    onCheck={this.onCheck.bind(that)}
                    showLine
                >
                    {contents.map(p => {
                        return that.loop(p);
                    })}
                </Tree>

            </div>
        );
    }
}
