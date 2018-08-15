import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class AreaTreeReport extends Component {
    constructor (props) {
        super(props);
        this.originOnCheck = this.props.onCheck;
        this.state = {
            checkkeys: []
        };
    }

    onCheck (keys, info) {
        this.originOnCheck(keys, info);
    }
    loop (p, loopTime) {
        let me = this;
        const that = this;
        let disableCheckbox = false;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime <= 3) {
            disableCheckbox = true;
        }
        if (p) {
            return (
                <TreeNode
                    title={p.Name}
                    key={p.No}
                    disableCheckbox={disableCheckbox}
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
            if (element != undefined) {
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
