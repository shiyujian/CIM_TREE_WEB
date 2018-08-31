import React, { Component } from 'react';
import { Tree } from 'antd';
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
        const { treeData = [] } = this.props;
        return (
            <div>
                {treeData.length ? (
                    <Tree
                        showLine
                        // selectedKeys={[this.props.selectedKeys]}
                        onSelect={this.props.onSelect}
                        // defaultExpandedKeys={areaTreeKeys}
                        // defaultSelectedKeys={areaTreeKeys}
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
