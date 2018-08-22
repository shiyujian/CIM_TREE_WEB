import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { WORKFLOW_API } from '_platform/api';
//
import { actionsMap } from '_platform/store/util';
import newsReducer, { actions as newsActions } from './news';
import staffReducer, { actions as staffActions } from './staff';
import datumReducer, { actions as datumActions } from './datum';

// 获取个人任务
// export const getTaskPersonOK = createAction('获取个人任务');
// export const getTaskPerson = createFetchAction(`${WORKFLOW_API}/participant-task`, [getTaskPersonOK]);
// export const actions = {
//     getTaskPersonOK,
//     getTaskPerson
// };
export default handleActions(
    {
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
        //
        [combineActions(...actionsMap(newsActions))]: (state, action) => {
            return { ...state, news: newsReducer(state.news, action) };
        },

        [combineActions(...actionsMap(staffActions))]: (state, action) => {
            return { ...state, staff: staffReducer(state.staff, action) };
        },
        [combineActions(...actionsMap(datumActions))]: (state, action) => {
            return { ...state, datum: datumReducer(state.datum, action) };
        }
    },
    {}
);
