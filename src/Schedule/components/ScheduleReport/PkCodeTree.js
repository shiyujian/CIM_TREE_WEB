import React, { Component } from 'react';
import { Tree } from 'antd';
import {getUserIsManager} from '_platform/auth';
const TreeNode = Tree.TreeNode;

export default class PkCodeTree extends Component {
    static propTypes = {};

    static loop (data = []) {
        let user = localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        console.log('user', user);
        let component = [];
        // 是否为业主或管理员
        let permission = getUserIsManager();
        if (permission) {
            return data.map((item, index) => {
                return <TreeNode key={item.No}
                    title={item.Name} />;
            });
        } else {
            let sections = user && user.account && user.account.sections;
            if (sections && sections instanceof Array && sections.length > 0) {
                let section = sections[0];
                console.log('section', section);
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
