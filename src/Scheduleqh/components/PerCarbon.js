/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
*
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react';
import { Spin,Select,TreeSelect   } from 'antd';
import style from './index.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {getUser} from '_platform/auth';

const Option = Select.Option;


@connect(
	state => {
		const {platform} = state;
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,}, dispatch)
	})
)


export default class PerCarbon extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            select: false,
            dataList: [],
            value: '',
            fetching: false
        }
        this.lastFetchId=0;
        this.put = [];

    }


    render(){

        let { fetching, dataList, value } = this.state;
        return (
            <div >
                <div >
                    <Select
                     id="CarbonSearchText"
                     mode="multiple"
                     placeholder="请输入人员姓名"
                     notFoundContent={fetching ? <Spin size="small" /> : null}
                     filterOption={false}
                     onSearch={this.fetchNode}
                     style={{width: '100%'}}
                     defaultActiveFirstOption={false}
                     onChange={this.handleChange}
                     disabled={this.props.carbonCopyDisabled}
                    >
                        {dataList.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                </div>
            </div>
        );
    }

    handleChange = (value) => {
        this.setState({ value });
        this.props.selectCarbonMember(value)
  }

    fetchNode = (value) => {
        const searchText = document.getElementById("CarbonSearchText");
        let login = getUser();
        const {
            actions: {
                getUsers
        }} = this.props;

        if(searchText.value){
            const postData = {
                keyword: searchText.value
            }
            this.lastFetchId += 1;
            const fetchId = this.lastFetchId;
            this.setState({ fetching: true });
            getUsers({}, postData).then((payload)=>{
                if (fetchId !== this.lastFetchId) {
                    return;
                }
                let tree = [];
                if(payload){
                    for(var i=0;i<payload.length;i++){
                        tree.push({
                            pk:payload[i].id,
                            code:payload[i].account.person_code,
                            name:payload[i].account.person_name,
                            username:payload[i].username
                        })
                    }
                }
                this.put = tree;
                let dataList = this.put.map(node => ({
                    text: node.name + '-' + node.username,
                    obj: JSON.stringify({
                        code:node.code,
                        name:node.name,
                        pk: node.pk,
                        username:node.username
                    }),
                    value:'C_PER'+'#'+node.code+'#'+node.name+'#'+node.pk+'#'+node.username,
                    fetching: false
                }));
                if(dataList.length===0) {
                dataList = [{
                    text:'未找到结果',
                    value:'none',
                    fetching: false
                }];
            }
            this.setState({ dataList });
            });
        }else{
            this.setState({ dataList : [] });
        }

    }

}
