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

const Option = Select.Option;


@connect(
    state => {
        const { platform } = state;
        return { platform };
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions, }, dispatch)
    })
)


export default class PerSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            select: false,
            dataList: [],
            value: '',
            fetching: false,
            text: null
        }
        this.lastFetchId = 0;
        this.put = [];

    }

    async componentDidMount() {
        const { actions: {
            getUsers
        } } = this.props
        try {
            await getUsers()
        } catch (error) {
            console.log(error)
        }
    }
    render() {

        const { fetching, value } = this.state;
        const {
           platform: { users = [] } = {}
        } = this.props
        let userList = [],
            tree = [],
            dataList = [];
        users.map(user => {
            user.groups.map(group=>{
                if(group.permissions instanceof Array){
                    group.permissions.map(per=>{
                        if(per === "flow_approval"||per === "appmeta.DATUM.READ") {
                            userList.push(user)
                        }
                    })
                }
            })
        })
        for (var i = 0;i <userList.length;i++){
            tree.push({
                pk:userList[i].id,
                code:userList[i].account.person_code,
                name: userList[i].account.person_name,
                username: userList[i].username
            })
        }
        dataList = tree.map(node=>({
            text:node.name,
            obj: JSON.stringify({
                code: node.code,
                name: node.name,
                pk: node.pk,
                username: node.username
            }),
            value: 'C_PER' + '#' + node.code + '#' + node.name + '#' + node.pk + '#' + node.username,
            fetching: false
        }));
        return (
            <div >
                <div >
                    <Select
                        showSearch
                        id="CarbonSearchText"
                        placeholder="请输入人员姓名"
                        filterOption={(inputValue, option) => option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=0}
                        style={{ width: '100%' }}
                        defaultActiveFirstOption={false}
                        onChange={this.handleChange}
                        value={this.state.text}
                    >
                        {dataList.map(d => <Option key={d.text} value={d.value}>{d.text}</Option>)}
                    </Select>
                </div>
            </div>
        );
    }

    handleChange = (value) => {
        let memberValue = value.toString().split('#');
        let text = null;
        if (memberValue[0] === 'C_PER') {
            text = memberValue[2]
        }
        this.setState({
            value: value,
            text: text
        });
        this.props.selectMember(value)
    }
}
