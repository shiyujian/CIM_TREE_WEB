import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API} from '_platform/api';
import {actionsMap} from '_platform/store/util';
const ID = 'DESIGN_BLUEPRINT';

export const getOrgListOK = createAction('获取组织机构树');
export const getOrgList = createFetchAction(`${SERVICE_API}/org-tree/`, [getOrgListOK]);
export const getTimeLineOK = createAction('获取周报时间树成功');
export const getTimeLine = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/`, [getTimeLineOK]);
//创建周报
export const createWeekly = createFetchAction(`${SERVICE_API}/documents/`, [], 'POST');
//获取周报列表
export const getWeekly = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{dir_code}}/`, []);
export const actions = {
	getOrgList,
	getOrgListOK,
	getTimeLine,
	getTimeLineOK,
	createWeekly,
	getWeekly,
};
export default handleActions({
	[getOrgListOK]: (state, {payload}) => ( {
		...state,
		orgLists: payload.children
	}),
	[getTimeLineOK]: (state, {payload}) => {
		return {
			...state,
			timeLines: payload.children
		}
	},
}, {});
