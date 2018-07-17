import React, { Component } from 'react';
import {
    Button, Modal
} from 'antd';
import { getUser } from '_platform/auth';
import '../Curing.less';
window.config = window.config || {};

export default class TaskTeamTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount () {
        const {
            actions: { getUsers, getRoles }
        } = this.props;
        let user = getUser();
        let sections = user.sections;
        sections = JSON.parse(sections);
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (!(sections && sections instanceof Array && sections.length > 0)) {
            return;
        }
        // 需要找到是养护角色的人
        let role = await getRoles();
        const curingRoles = role.filter(rst => rst.grouptype === 4);
        let roles = curingRoles.map(item => { return item.id; });
        console.log('roles', roles);
        try {
            let postdata = {};
            postdata = {
                roles: roles,
                sections: sections,
                is_active: true
            };

            let users = await getUsers({}, postdata);
            console.log('users', users);
            this.setState({
                users
            });
        } catch (error) {
            console.log(error);
        }
    };

    render () {
        return (
            <div />
        );
    }
}
