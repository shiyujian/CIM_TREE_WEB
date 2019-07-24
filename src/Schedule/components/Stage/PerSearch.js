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
import {
    getTemplateOrg,
    getNextStates
} from '_platform/components/Progress/util';

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

    async componentDidUpdate (prevProps, prevState) {
        const {
            code,
            visible
        } = this.props;
        if (code !== prevProps.code) {
            this.query();
        }
        if (visible !== prevProps.visible) {
            this.setState({
                text: ''
            });
        }
    }

    query = async () => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let user = await getUser();
        let section = user.section;
        let roles = await getRoles();
        if (!section) {
            return;
        }
        let postRoleData = '';
        roles.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName === '监理文书') {
                postRoleData = role.ID;
            }
        });
        try {
            let postdata = {
                role: postRoleData,
                section: section,
                status: 1,
                page: 1,
                size: 20
            };
            let results = [];
            let userList = await getUsers({}, postdata);
            if (userList && userList.code && userList.code === 200) {
                results = results.concat((userList && userList.content) || []);
                let total = userList.pageinfo.total;
                if (total > 20) {
                    for (let i = 0; i < (total / 20) - 1; i++) {
                        postdata = {
                            role: postRoleData,
                            section: section,
                            status: 1,
                            page: i + 2,
                            size: 20
                        };
                        let datas = await getUsers({}, postdata);
                        if (datas && datas.code && datas.code === 200) {
                            results = results.concat((datas && datas.content) || []);
                        }
                    }
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
                userList[i].ID &&
                userList[i].Full_Name &&
                userList[i].User_Name
            ) {
                tree.push({
                    pk: userList[i].id,
                    name: userList[i].Full_Name,
                    username: userList[i].User_Name,
                    org: userList[i].Org
                });
            }
        }
        dataList = tree.map(node => ({
            text: node.name + '(' + node.username + ')',
            obj: JSON.stringify({
                name: node.name,
                pk: node.pk,
                username: node.username,
                org: node.org
            }),
            value:
                'C_PER' +
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
