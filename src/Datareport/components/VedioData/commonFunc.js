import React from 'react';
import {message, Select} from 'antd';
const Option = Select.Option;
import {getUser} from '_platform/auth';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api.js';
import {FILE_API, USER_API} from '_platform/api';
const moment = require('moment');
//import {actions} from '../../store/vedioData';

export const launchProcess = (data,actions)=>{  //发起流程
    const {dataSource,selectUser,name,description=null} = data,
        {createWorkflow,logWorkflowEvent} = actions;
    
    const {id,username,person_name,person_code} = getUser(),
        creator = {id,username,person_name,person_code},
        postdata = {
            name,
            code:WORKFLOW_CODE["数据报送流程"],
            description:name,
            subject:[{
                data:JSON.stringify(dataSource)
            }],
            creator,
            plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
            deadline:null,
            status:"2"
        };
    
    createWorkflow({},postdata).then((rst) => {
        const {id: pk, current:{0:{id: currentId }}} = rst,
            {0:{to_state:{0:{id: stateId }}}} =  getNextStates(rst,currentId);
            
        logWorkflowEvent({pk:pk},{
            state:currentId,
            action:'提交',
            note:description?description:'发起填报',
            executor:creator,
            next_states:[{
                participants:[selectUser],
                remark:"",
                state:stateId
            }],
            attachment:null
        })
    })
}

export const addSerialNumber = (data=[])=>{ //给数据添加序号
    let n = 1 ;
    return data.map(record =>{
        return Object.assign({},record,{
            index: n++
        })
    })
}

const myHeaders = new Headers();    //创建一个fetch请求头

export const uploadFile = async (file)=>{   //上传文件返回文件的部分信息
    const formdata = new FormData();

    formdata.append('a_file', file);
    formdata.append('name', file.name);
    const myInit = {
        method: 'POST',
        headers: myHeaders,
        body: formdata
    };

    const resp = await (await fetch(`${FILE_API}/api/user/files/`,myInit)).json();
    if (!resp || !resp.id) {
        message.error('文件上传失败')
        return;
    };
    let filedata = resp;
    filedata.a_file = covertURLRelative(filedata.a_file);
    filedata.download_url = covertURLRelative(filedata.a_file);

    const {size,id,name,a_file,download_url,mime_type} = filedata;
    return {
        size,id, name, a_file ,download_url, mime_type,
        status: 'done',
        url: a_file
    };
}
const covertURLRelative = (originUrl) => {
    return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
}

export const getAllUsers = async ()=>{
    const myInit = {
        method: 'GET',
        headers: myHeaders
    };

    const resp = await (await fetch(`${USER_API}/users/`,myInit)).json();
    
    return resp.map(record=>{
        const {id,username,account:{person_name,person_code,organization}} = record,
            userData = {id,username,person_name,person_code,organization};
        
        return <Option key={id} value={JSON.stringify(userData)}>{person_name}</Option>
    })
}

//通过流程
export const throughProcess = (wk,actions)=>{
    const {id,username,name:person_name,code:person_code} = getUser(),
        executor = {id,username,person_name,person_code},
        {logWorkflowEvent} = actions;

    logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor,attachment:null});
}