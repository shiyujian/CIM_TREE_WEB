import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DashPanel extends Component {
    constructor (props) {
        super(props);
        this.originOnCheck = this.props.onCheck;
        this.originOnSelect = this.props.onSelect;
        this.state = {
            checkkeys: []
        };
    }

    onCheck (keys, info) {
        console.log('yeye:', keys, info);
        this.originOnCheck(keys, info);
    }

    onSelect (keys, info) {
        this.originOnSelect(keys, info);
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
                    // disableCheckbox={disableCheckbox}
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
        console.log('wawa:', content);
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
