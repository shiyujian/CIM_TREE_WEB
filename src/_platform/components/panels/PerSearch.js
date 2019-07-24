/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import { Spin, Select } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '../../../_platform/store/global';
import { getUser } from '../../../_platform/auth';
import {
    getTemplateOrg,
    getNextStates
} from '../../../_platform/components/Progress/util';

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
            task,
            visible
        } = this.props;
        if (task !== prevProps.task) {
            console.log('componentDidUpdatetask', task);
            console.log('prevPropstask', prevProps.task);
            this.query();
        }
        if (code !== prevProps.code) {
            console.log('componentDidUpdatecode', code);
            console.log('prevPropscode', code);
            this.query();
        }
        if (visible !== prevProps.visible) {
            console.log('visiblevisiblevisiblevisiblevisiblevisible');
            this.setState({
                text: ''
            });
        }
    }

    async query () {
        const {
            actions: {
                getUsers
            },
            roleSearch = false
        } = this.props;
        let user = getUser();

        let section = user.section;
        if (!section) {
            return;
        }

        try {
            let postdata = {};
            // 是按照部门搜索  还是按照角色搜索
            if (!roleSearch) {
                postdata = {
                    sections: section,
                    status: 1
                };
            } else {
                postdata = {
                    sections: section,
                    status: 1
                };
            }

            let datas = await getUsers({}, postdata);
            let users = [];
            if (datas && datas.code && datas.code === 200) {
                users = (datas && datas.content) || [];
            }
            // 因多个组件公用此组件，不能放在redux里
            this.setState({
                users
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
                !userList[i].ID ||
                !userList[i].Full_Name ||
                !userList[i].User_Name ||
                !userList[i].Org
            ) {
                console.log('sssssssssssssssssssssssssss', userList[i]);
            }

            if (
                userList[i].ID &&
                userList[i].User_Name &&
                userList[i].Full_Name &&
                userList[i].Org
            ) {
                tree.push({
                    id: userList[i].ID,
                    phone: userList[i].Phone,
                    name: userList[i].Full_Name,
                    username: userList[i].User_Name,
                    org: userList[i].Org
                });
            }
        }
        dataList = tree.map(node => ({
            text: node.name + '(' + node.username + ')',
            obj: JSON.stringify({
                phone: node.phone,
                name: node.name,
                id: node.id,
                username: node.username,
                org: node.org
            }),
            value:
                'C_PER' +
                '#' +
                node.phone +
                '#' +
                node.name +
                '#' +
                node.id +
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
                        // defaultActiveFirstOption={false}
                        onChange={this.handleChange}
                        value={this.state.text}
                    >
                        {dataList.map(d => (
                            <Option key={d.text} title={d.text} value={d.value}>
                                {d.text}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        );
    }

    handleChange = value => {
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
