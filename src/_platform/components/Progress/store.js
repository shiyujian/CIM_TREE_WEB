/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createAction, handleActions} from 'redux-actions';
import createFetchAction from '../fetchAction';

export const getTaskOK = createAction('获取所有执行中流程');
export const getTask = createFetchAction(`{{Workflow_API}}/service/workflow/api/participant-task/`,[getTaskOK]);

export const getWorkFlowTypeOK = createAction('获取所有流程类别');
export const getWorkFlowType = createFetchAction(`{{Workflow_API}}/service/workflow/api/template/?status=1`,[getWorkFlowTypeOK]);

export const getWorkFlowDetailOK = createAction('获取流程详情');
export const getWorkFlowDetail = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/{{pk}}`,[getWorkFlowDetailOK]);

export const getUserListOK = createAction('获取人员列表');
export const getUserList = createFetchAction(`{{Workflow_API}}/accounts/api/users/`,[getUserListOK]);

export const getUserDetailOK = createAction('获取人员详情');
export const getUserDetail = createFetchAction(`{{Workflow_API}}/accounts/api/users/{{pk}}`,[getUserDetailOK]);

export const getORGOK = createAction('获取部门单级树');
export const getORG = createFetchAction(`{{Workflow_API}}/service/construction/api/orgs/{{pk}}/`,[getORGOK]);

export const getORGTreeOK = createAction('获取部门多级树');
export const getORGTree = createFetchAction(`{{Workflow_API}}/service/construction/api/org-tree/{{pk}}/`,[getORGTreeOK]);

export const getORGMemberOK = createAction('获取部门人员');
export const getORGMember = createFetchAction(`{{Workflow_API}}/accounts/api/users/`,[getORGMemberOK]);

export const getRoleTreeOK = createAction('获取角色树');
export const getRoleTree = createFetchAction(`{{Workflow_API}}/accounts/api/roles/{{pk}}/`,[getRoleTreeOK]);

export const getRoleMemberOK = createAction('获取角色树人员');
export const getRoleMember = createFetchAction(`{{Workflow_API}}/accounts/api/roles/{{pk}}/members/`,[getRoleMemberOK]);

export const setStateID = createAction('设置当前任务的执行中的state的ＩＤ');




export const setCurrentTreeNodes = createAction('设置当前树根节点');



//通过或退回
export const approvedFlow = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/{{pk}}/logevent/`,[],'POST');
//指定抄送人
export const carbonCopy = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/{{pk}}/carbon-copy/`,[],'POST');
//拒绝流程
export const rejectFlow = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/{{pk}}/reject/`,[],'POST');
//废止流程
export const abolishFlow = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/{{pk}}/abolish/`,[],'POST');
//委托流程
export const delgateFlow = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/{{pk}}/delegate/`,[],'POST');

export default handleActions({
    [getTaskOK]: (state, {payload}) => {
        return {
            ...state,
            allTasks: payload
        }
    },
    [getWorkFlowTypeOK]: (state, {payload}) => {
        return{
            ...state,
            workFlowType: payload
        }
    },
    [getWorkFlowDetailOK]: (state, {payload}) => {
        return{
            ...state,
            workFlowDetail: payload,
            temPlateCode: payload.workflow.code,
            workFlowSubject: payload.subject,
            workFlowHistory: payload.history,
            workFlow: payload.workflow,
        }
    },
    [getUserListOK]: (state, {payload}) => {
        let tree = [];
        console.log('payload',payload)
        if(payload){
            for(var i=0;i<payload.length;i++){
                tree.push({
                    pk:payload[i].id,
                    code:payload[i].account.person_code,
                    name:payload[i].account.person_name,
                    username:payload[i].username,
                })
            }
        }
        return{
            ...state,
            userList: tree
        }
    },
    [getUserDetailOK]: (state, {payload}) => {
        return{
            ...state,
            userDetail: payload
        }
    },
    [getORGOK]: (state, {payload}) => {
        return{
            ...state,
            org: payload
        }
    },
    [getORGTreeOK]: (state, {payload}) => {
        return{
            ...state,
            orgTree: payload
        }
    },
    [getRoleTreeOK]: (state, {payload}) => {
        return{
            ...state,
            roleTree: payload
        }
    },
    [getRoleMemberOK]: (state, {payload}) => {
        let tree = [];
        console.log('payload',payload)
        if(payload){
            for(var i=0;i<payload.members.length;i++){
                tree.push({
                    pk:payload.members[i].id,
                    code:payload.members[i].account.person_code,
                    name:payload.members[i].account.person_name,
                    username:payload.members[i].username,
                })
            }
        }
        return{
            ...state,
            RoleMember: tree
        }
    },
    [getORGMemberOK]: (state, {payload}) => {
        let tree = [];
        if(payload){
            for(var i=0;i<payload.length;i++){
                tree.push({
                    pk:payload[i].id,
                    code:payload[i].account.person_code,
                    name:payload[i].account.person_name,
                    username:payload[i].username,
                })
            }
        }
        return{
            ...state,
            ORGMember: tree
        }
    },
    [setCurrentTreeNodes]: (state, {
        payload
    }) => {
        return {
            ...state,
            rootTreeNodes: payload.rootTreeNodes
        }
    },
    [setStateID]: (state, {
        payload
    }) => {
        return {
            ...state,
            stateID: payload
        }
    },
}, {});
