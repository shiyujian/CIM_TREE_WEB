/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { getUser } from '_platform/auth';
const Option = Select.Option;

@connect(
    state => {
        const { platform } = state;
        return { platform };
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions }, dispatch)
    })
)
export default class PerSearch extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: '',
            text: null,
            users: [],
            getStatus: true
        };
    }

    async componentDidMount () {
        this.query();
    }

    query = async () => {
        const {
            actions: { getUsers, getRoles }
        } = this.props;
        let user = await getUser();
        let sections = user.sections;
        sections = JSON.parse(sections);
        let roles = await getRoles();
        console.log('roles', roles);
        if (!(sections && sections instanceof Array && sections.length > 0)) {
            return;
        }
        let postRole = [];
        roles.map((role) => {
            if (role && role.id && role.name && role.name === '监理文书') {
                postRole.push(role.id);
            }
        });
        try {
            let postdata = {
                roles: postRole,
                sections: sections,
                is_active: true,
                page: 1,
                page_size: 20
            };
            let results = [];
            let users = await getUsers({}, postdata);
            console.log('users', users);
            results = results.concat((users && users.results) || []);
            let total = users.count;
            if (total > 20) {
                for (let i = 0; i < (total / 20) - 1; i++) {
                    postdata = {
                        roles: postRole,
                        sections: sections,
                        is_active: true,
                        page: i + 2,
                        page_size: 20
                    };
                    let datas = await getUsers({}, postdata);
                    results = results.concat((datas && datas.results) || []);
                }
            }
            this.setState({
                users: results
            });
        } catch (error) {
            console.log(error);
        }
    }

    render () {
        const { users } = this.state;
        let userList = [],
            tree = [],
            dataList = [];
        users.map(user => {
            userList.push(user);
        });
        for (var i = 0; i < userList.length; i++) {
            if (
                userList[i].id &&
                userList[i].account.person_code &&
                userList[i].account.person_name &&
                userList[i].account.org_code
            ) {
                tree.push({
                    pk: userList[i].id,
                    code: userList[i].account.person_code,
                    name: userList[i].account.person_name,
                    username: userList[i].username,
                    org: userList[i].account.org_code
                });
            }
        }
        dataList = tree.map(node => ({
            text: node.name + '(' + node.username + ')',
            obj: JSON.stringify({
                code: node.code,
                name: node.name,
                pk: node.pk,
                username: node.username,
                org: node.org
            }),
            value:
                'C_PER' +
                '#' +
                node.code +
                '#' +
                node.name +
                '#' +
                node.pk +
                '#' +
                node.username +
                '#' +
                node.org,
            fetching: false
        }));
        return (
            <div>
                <div>
                    <Select
                        showSearch
                        id='CarbonSearchText'
                        placeholder='请输入人员姓名'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                        onChange={this.handleChange.bind(this)}
                        value={this.state.text}
                    >
                        {dataList.map(data => (
                            <Option key={data.text} title={data.text} value={data.value}>
                                {data.text}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        );
    }

    handleChange = (value) => {
        let memberValue = value.toString().split('#');
        let text = null;
        if (memberValue[0] === 'C_PER') {
            text = memberValue[2];
        }
        this.setState({
            value: value,
            text: text
        });
        this.props.selectMember(value);
    };
}
