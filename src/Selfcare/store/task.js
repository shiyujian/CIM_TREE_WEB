import {combineActions, handleActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API,WORKFLOW_API,base} from '_platform/api';
const ID = 'SELFCARE_TASK';
const parameterReducer = fieldFactory(ID, 'parameter');

export const setTaskDetailLoading = createAction(`${ID}_设置任务详情loading的值`);
//创建新增的施工包
export const postPackage = createFetchAction(`${SERVICE_API}/workpackages/`, [],'POST');
//获取当前的单位工程的施工包数据
export const getPackage = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, []);
//修改施工包是否已发起填报通知
export const putPackage = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [],'PUT');
//更改某个state的deadline
export const patchDeadline = createFetchAction(`${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`, [],'PATCH');
//更改流程中存储的subject数据
export const postSubject = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/subject/`, [],'POST');
//查看流程详情
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`,[],'GET');
//打开数据报送模块 的审核模态框
export const changeDatareportVisible = createAction("打开或关闭数据报送的modal")
//获取资源文件下载链接
export const downloadFilesLink = createFetchAction(`${base}/pf/api/file-link/{{id}}/`, [], 'GET');

export const actions = {
	...parameterReducer,
	setTaskDetailLoading,
	postPackage,
	getPackage,
	putPackage,
	patchDeadline,
	postSubject,
	getWorkflowById,
	changeDatareportVisible,
	downloadFilesLink
};

export default handleActions({
	[setTaskDetailLoading]: (state, {payload}) => ({
		...state,
		detailLoading: payload
	}),
	[changeDatareportVisible]: (state, {payload}) => {
		let res = {...state}
		let {key,value} = payload
		res[key] = value
		return res
	},
	[combineActions(...actionsMap(parameterReducer))]: (state, action) => ({
		...state,
		parameter: parameterReducer(state.parameter, action),
	}),
}, {});