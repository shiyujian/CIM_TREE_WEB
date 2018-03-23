import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
// import createFetchAction from 'fetch-action';
import {base, SERVICE_API,WORKFLOW_API} from '_platform/api';
const ID = 'home_datum';

export const getTaskPersonOK = createAction('获取个人任务');
// export const getTaskPerson = createFetchAction(`${WORKFLOW_API}/participant-task`, [getTaskPersonOK]);
export const getTaskPerson = createFetchAction(`${WORKFLOW_API}/participant-task?task=processing&executor={{userid}}&order_by=-real_start_time`, [getTaskPersonOK]);
export const actions = {
    getTaskPersonOK,
    getTaskPerson,
};
export default handleActions({
	// [getTaskPersonOK](state, {payload = []}){
	// 	let tasks = [];
	// 	payload.map((task) => {
	// 		tasks.push({
	// 			id: task.workflowactivity.id || '',
	// 			time: task.workflowactivity.real_start_time || '',
	// 			doc_id: task.workflowactivity.subject[0].id || '',
	// 			name: task.workflowactivity.name || '',
	// 		});
	// 	});
	// 	return {
	// 		...state,
	// 		tasks
	// 	}
	// },
	[getTaskPersonOK](state, {payload}){
		return{
			...state,
			usertasks: payload
		}
	}, 
},
{});
