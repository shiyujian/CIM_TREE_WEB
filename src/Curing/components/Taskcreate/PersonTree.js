import React, { Component } from 'react';
import { Select } from 'antd';
import { getUser } from '_platform/auth';
const Option = Select.Option;

export default class PersonTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            UserOptions: [],
            users: []
        };
    }

    async componentDidMount () {
        const {
            actions: { getUsers, getRoles }
        } = this.props;
        let user = getUser();
        let sections = user.sections;
        sections = JSON.parse(sections);
        if (!(sections && sections instanceof Array && sections.length > 0)) {
            return;
        }
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
            let UserOptions = users.map((user) => {
                return (<Option key={user.id} value={String(user.id)} title={user.account.person_name + '-' + '(' + user.username + ')'}>
                    {user.account.person_name + '-' + '(' + user.username + ')' }
                </Option>);
            });
            this.setState({
                users,
                UserOptions
            });
        } catch (error) {
            console.log(error);
        }
    };

    render () {
        const {
            UserOptions
        } = this.state;
        return (
            <Select
                style={{ width: '100%' }}
                showSearch
                allowClear
                optionFilterProp='children'
                filterOption={(input, option) =>
                    option.props.children
                        .toLowerCase()
                        .indexOf(
                            input.toLowerCase()
                        ) >= 0
                }
                mode='multiple'
            >
                {UserOptions}
            </Select>
        );
    }
}
