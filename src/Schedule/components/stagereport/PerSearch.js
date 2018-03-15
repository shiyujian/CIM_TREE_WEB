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
import { getTemplateOrg,getNextStates } from '../../../_platform/components/Progress/util';

const Option = Select.Option;


@connect(
    state => {
        const { platform } = state;
        return { platform };
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions  }, dispatch)
    })
)

export default class PerSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: null,
            users:[],
            getStatus:true
        }
    }

    async componentDidMount() {
        this.query()
    }

    async componentDidUpdate(prevProps,prevState){
        const { actions: 
            {
                getUsers,
                getWorkflowTemplate
            },
            code,
            roleSearch = false,
            task
        } = this.props
        if(task != prevProps.task ){
            console.log('componentDidUpdatetask',task)
            console.log('prevPropstask',prevProps.task)
            this.query()
        }
        if(code != prevProps.code){
            console.log('componentDidUpdatecode',code)
            console.log('prevPropscode',code)
            this.query()
        }
    }

    async query(){
        const { actions: 
            {
                getUsers,
                getWorkflowTemplate
            },
            code,
            roleSearch = false,
            task
        } = this.props
        let org_code = ['003']
        let role_code = ['001']
        //如果是开始创建流程时  使用code来查找人员
        if(code){
            let params = {
                code: code
            }
            let templateMess = await getWorkflowTemplate(params)
            console.log('templateMess',templateMess)
            if(templateMess && templateMess.states){
                let state = templateMess.states[0]
                //获取模版下一个节点的部门信息
                let nextMess = getTemplateOrg(templateMess);
                console.log('nextMess',nextMess)
                //如果第一步有多个action或者是多个执行人  需要进行判断  重新改写组件
                if(nextMess && nextMess instanceof Array){
                    try{
                        let orgs = nextMess[0].to_state[0].orgs
                        org_code = []
                        orgs.map((rst)=>{
                            org_code.push(rst.code)
                        })


                        let roles = nextMess[0].to_state[0].roles
                        role_code = []
                        roles.map((rst)=>{
                            role_code.push(rst.code)
                        })
                    }catch(e){
                        console.log(e)
                        
                    }
                }
            }
        }else{
            console.log('task',task)
            if(task && task.current){
                let state_id = task.current[0].id
                let nextStates = getNextStates(task, Number(state_id));
                console.log('nextStates',nextStates)
                if(nextStates && nextStates instanceof Array){
                    nextStates.map((rst)=>{
                        if(rst.action_name != '退回'){
                            try{
                                let orgs = rst.to_state[0].orgs
                                org_code = []
                                orgs.map((org)=>{
                                    org_code.push(org.code)
                                })
        
        
                                let roles = rst.to_state[0].roles
                                role_code = []
                                roles.map((role)=>{
                                    role_code.push(role.code)
                                })
                            }catch(e){
                                console.log(e)
                                
                            }
                        }
                    })
                }
            }
        }

        console.log('org_code',org_code)

        try {
            let postdata = {}
            //是按照部门搜索  还是按照角色搜索
            if(!roleSearch){
                postdata = {
                    org_code : org_code
                }
            }else{
                postdata = {
                    role_code : role_code
                }
            }
            
            let users = await getUsers({},postdata)
            //因多个组件公用此组件，不能放在redux里
            this.setState({
                users
            })
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        const { fetching, value, users } = this.state;
        let userList = [],
            tree = [],
            dataList = [];
        users.map(user => {
            userList.push(user)
        })
        for (var i = 0;i <userList.length;i++){
            if(!(userList[i].id) || !(userList[i].account.person_code) || !(userList[i].account.person_name) || !(userList[i].username) || !(userList[i].account.organization)){
                console.log('sssssssssssssssssssssssssss',userList[i])
            }
            
            if( userList[i].id && userList[i].account.person_code && userList[i].account.person_name && userList[i].account.organization){
                tree.push({
                    pk:userList[i].id,
                    code:userList[i].account.person_code,
                    name: userList[i].account.person_name,
                    username: userList[i].username,
                    org:userList[i].account.organization,
                })
            }
            
        }
        dataList = tree.map(node=>({
            text:node.name,
            obj: JSON.stringify({
                code: node.code,
                name: node.name,
                pk: node.pk,
                username: node.username,
                org:node.org,
            }),
            // value: 'C_PER' + '#' + node.code + '#' + node.name + '#' + node.pk + '#' + node.username,
            value: 'C_PER' + '#' + node.code + '#' + node.name + '#' + node.pk + '#' + node.username + '#' + node.org,
            fetching: false
        }));
        console.log('dataList',dataList)
        return (
            <div >
                <div >
                    <Select
                        showSearch
                        id="CarbonSearchText"
                        placeholder="请输入人员姓名"
                        optionFilterProp="children"
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: '100%' }}
                        // defaultActiveFirstOption={false}
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
        console.log('this.props.code',this.props.code)
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
