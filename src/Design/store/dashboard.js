import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API} from '_platform/api';

export const getDoctimestatsOK = createAction('基于目录的文档时间对比统计');
export const getDoctimestats = createFetchAction(`${SERVICE_API}/directory/doctimestats/{{code}}/`, [getDoctimestatsOK]);
//获取项目项目下的单位工程
export const getWorkpackages = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`,[]);
//获取项目信息
export const getProjects = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/`,[]);

export const actions = {
	getDoctimestatsOK,
	getDoctimestats,
	getWorkpackages,
	getProjects
};
export default handleActions({
	[getDoctimestatsOK]: (state, {payload}) => {
		return {
			...state,
			doctimestats: payload
		}
	},
}, {});
