import {createAction, handleActions, combineActions} from 'redux-actions';
// import createFetchAction from './fetchAction';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API,WORKFLOW_API} from '_platform/api';

//获取项目树
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
//获取具体项目树下子项目或单元
export const getSubTreeOK = createAction('获取具体某个项目信息');
export const getSubTree = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/`, [getSubTreeOK]);

export const actions = {
	getProjectTree,
	getSubTree,
};
export default handleActions({
	[getSubTreeOK]: (state, {payload}) =>  {
		return {
			...state,
			subsection: payload.children
		}
	}
}, {});
