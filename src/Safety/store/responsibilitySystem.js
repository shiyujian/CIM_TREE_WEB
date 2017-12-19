import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API} from '_platform/api'

export const ID = 'RESPONSIBILITYSYSTEM';

export const setIsEdit =  createAction ('安全责任制-设置编辑状态');
export const setIsAdd =  createAction ('安全责任制-设置新增状态');
export const setCurrentAcc =  createAction ('安全责任制-设置当前事故');
export const setAddModalVisible = createAction('安全责任制-设置添加内容操作窗可视性');
export const setEditModalVisible = createAction('安全责任制-设置编辑内容操作窗可视性');

//添加安全责任制
const addResponsibility = createFetchAction(`${base}/main/api/safety-response/`,[],'POST');
const getResponsibility = createFetchAction(`${base}/main/api/safety-response/`,[],'GET');
const patchResponsibility = createFetchAction(`${base}/main/api/safety-response/{{pk}}/`,[],'PATCH');
const deleteResponsibility = createFetchAction(`${base}/main/api/safety-response/{{pk}}/`,[],'DELETE');
//月考核
const postMonthResponse = createFetchAction(`${base}/main/api/safety-response/{{pk}}/month-check/`,[],'POST');
const getMonthResponse = createFetchAction(`${base}/main/api/month-check/{{pk}}/`,[],'GET');
const patchMonthResponse = createFetchAction(`${base}/main/api/month-check/{{pk}}/`,[],'PATCH');
const deleteMonthResponse = createFetchAction(`${base}/main/api/month-check/{{pk}}/`,[],'DELETE');
//年考核
const postYearResponse = createFetchAction(`${base}/main/api/safety-response/{{pk}}/year-check/`,[],'POST');
const getYearResponse = createFetchAction(`${base}/main/api/year-check/{{pk}}/`,[],'GET');
const patchYearResponse = createFetchAction(`${base}/main/api/year-check/{{pk}}/`,[],'PATCH');
const deleteYearResponse = createFetchAction(`${base}/main/api/year-check/{{pk}}/`,[],'DELETE');

const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');

export const actions = {
	addResponsibility,
	getResponsibility,
    patchResponsibility,
    deleteResponsibility,
    postMonthResponse,
    getMonthResponse,
    patchMonthResponse,
    deleteMonthResponse,
    postYearResponse,
    getYearResponse,
    patchYearResponse,
    deleteYearResponse,
    getWorkpackagesByCode
};

export default handleActions({
	[setIsEdit]:(state, {payload}) => {
        return {
            ...state,
            isEdit: payload
        }
    },
    [setIsAdd]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            isAdd: payload
        }
	},
	[setCurrentAcc]:(state, {payload}) => {
        return {
            ...state,
            currentAcc: payload
        }
    },
	[setAddModalVisible]:(state, {payload}) => {
        return {
            ...state,
            AddModalVisible:payload.AddModalVisible
        }
    },
    [setEditModalVisible]:(state, {payload}) => {
        return {
            ...state,
            EditModalVisible:payload.EditModalVisible
        }
    }
}, {});
