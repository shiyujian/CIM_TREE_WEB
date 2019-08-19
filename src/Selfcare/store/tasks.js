import {combineActions, handleActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {base, WORKFLOW_API} from '_platform/api';

const ID = 'SELFCARE_TASKS';

const filterReducer = fieldFactory(ID, 'filter');

export const setLoadingStatus = createAction(`${ID}_设置任务列表loading的值`);
export const setTablePage = createAction(`${ID}_设置任务列表Table的页数`);
export const getTasksList = createFetchAction(`${WORKFLOW_API}/template/?status=1`, [], 'GET');

// 2019-7-23两库合并新接口
// 获取已办任务列表
export const getWorkprocessesList = createFetchAction(`${base}/flow/workprocesses`, [], 'GET');
// 获取待办任务列表
export const getWorkList = createFetchAction(`${base}/flow/works`, [], 'GET');
// 获取流程列表
export const getFlowList = createFetchAction(`${base}/flow/flows`, [], 'GET');
// 获取任务详情
export const getWorkDetails = createFetchAction(`${base}/flow/work/{{ID}}`, [], 'GET');
// 获取任务详情
export const postSendwork = createFetchAction(`${base}/flow/sendwork`, [], 'POST');
export const actions = {
	getWorkprocessesList,
	getWorkList,
	getFlowList,
	getWorkDetails,
	postSendwork,
	...filterReducer,
	setLoadingStatus,
	setTablePage,
	getTasksList
};

export default handleActions({
	[setLoadingStatus]: (state, {payload}) => ({
		...state,
		loadingstatus: payload
	}),
	[setTablePage]: (state, {payload}) => ({
		...state,
		pagination: payload
	}),
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.field, action),
	}),
}, {});
