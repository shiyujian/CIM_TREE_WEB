import React, { Component } from 'react';
import { Tree } from 'antd';
import {getUserIsManager, getUser} from '_platform/auth';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {
    static propTypes = {};

    static loop (data = []) {
        let user = getUser();
        let component = [];
        // 是否为业主或管理员
        let permission = getUserIsManager();
        if (permission) {
            return data.map((item, index) => {
                return <TreeNode key={item.No}
                    title={item.Name} />;
            });
        } else {
            let section = user && user.section;
            if (section) {
                let code = section.split('-');
                if (code && code.length === 3) {
                    data.map((item, index) => {
                        if (code[0] === item.No) {
                            component.push(
                                <TreeNode key={item.No}
                                    title={item.Name} />
                            );
                        }
                    });
                    return component;
                }
            }
        }
    };

    render () {
        const { treeData = [] } = this.props;
        return (
            <div>
                {treeData.length
                    ? <Tree showLine
                        selectedKeys={[this.props.selectedKeys]}
                        defaultExpandAll
                        autoExpandParent
                        onSelect={this.props.onSelect}
                        onExpand={this.props.onExpand}
                    >
                        {
                            PkCodeTree.loop(treeData)
                        }
                    </Tree>
                    : ''
                }
            </div>
        );
    }
}
