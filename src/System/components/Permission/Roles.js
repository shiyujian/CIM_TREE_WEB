import React, { Component } from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export default class Roles extends Component {
    static propTypes = {};

    render () {
        const {
            platform: { roles = [] } = {},
            table: { role = {} } = {}
        } = this.props;
        let parentRoleType = [];
        roles.map((role) => {
            if (role && role.ID && role.ParentID === 0) {
                parentRoleType.push(role);
            }
        });
        const id = String(role.ID);
        return (
            <div>
                <Tree
                    showLine
                    style={{ paddingLeft: '30px', marginTop: '10px' }}
                    onSelect={this.select.bind(this)}
                    selectedKeys={[id]}
                >
                    {
                        parentRoleType.map((type) => {
                            return (<TreeNode key={type.ID} title={type.RoleName} disabled>
                                {
                                    roles.map((role) => {
                                        if (role && role.ID && role.ParentID && role.ParentID === type.ID) {
                                            return <TreeNode key={role.ID} title={role.RoleName} />;
                                        }
                                    })
                                }
                            </TreeNode>);
                        })
                    }
                </Tree>
            </div>
        );
    }

    componentDidMount = async () => {
        const {
            actions: { getRoles },
            actions: { changeTableField }
        } = this.props;
        await getRoles();
        await changeTableField('role', '');
        await changeTableField('permissionsCodes', []);
    }

    select = async (s, node) => {
        const {
            platform: { roles = [] } = {},
            actions: { changeTableField }
        } = this.props;
        const { node: { props: { eventKey = '' } = {} } = {} } = node || {};
        const role = roles.find(role => role.ID === +eventKey);
        if (role && role.ID && role.ParentID && role.Functions) {
            let permissionsCodes = [];
            role.Functions.map((permission) => {
                permissionsCodes.push((permission.FunctionCode));
            });
            await changeTableField('role', role);
            await changeTableField('permissionsCodes', permissionsCodes);
        } else {
            await changeTableField('role', '');
            await changeTableField('permissionsCodes', []);
        }
    }
}
