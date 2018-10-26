import React, { Component } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class CheckGroupTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    onSelect (keys, info) {
        this.props.onSelect(keys, info);
    }

    loop (p, loopTime) {
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime === 1) {
            if (p) {
                return (
                    <TreeNode
                        key={p.id}
                        title={p.name}
                    >
                        {p.children &&
                            p.children.map(m => {
                                return this.loop(m, loopTime);
                            })}
                    </TreeNode>
                );
            }
        } else {
            if (p) {
                return (
                    <TreeNode
                        key={p.id}
                        title={p.name}
                    />
                );
            }
        }
    }

    render () {
        let {
            content = [],
            groupSelectKey
        } = this.props;
        let contents = [];
        for (let j = 0; j < content.length; j++) {
            const element = content[j];
            if (element !== undefined) {
                contents.push(element);
            }
        }
        console.log('groupSelectKey', groupSelectKey);
        return (
            <div>
                <Tree
                    onSelect={this.onSelect.bind(this)}
                    showLine
                    selectedKeys={[groupSelectKey]}
                >
                    {contents.map(p => {
                        return this.loop(p);
                    })}
                </Tree>

            </div>
        );
    }
}
