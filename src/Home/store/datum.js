import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import { base, WORKFLOW_API } from '_platform/api';
const ID = 'home_datum';

export const getTaskPersonOK = createAction('获取个人任务');
// export const getTaskPerson = createFetchAction(`${WORKFLOW_API}/participant-task`, [getTaskPersonOK]);
export const getTaskPerson = createFetchAction(
    `${WORKFLOW_API}/participant-task?task=processing&executor={{userid}}&order_by=-real_start_time`,
    [getTaskPersonOK]
);
// 2019-7-23两库合并新接口
// 获取待办任务列表
export const getWorkList = fetchAction(`${base}/flow/works`, [], 'GET');
export const actions = {
    getWorkList,
    getTaskPersonOK,
    getTaskPerson
};
export default handleActions(
    {
        [getTaskPersonOK] (state, { payload }) {
            return {
                ...state,
                usertasks: payload
            };
        }
    },
    {}
);
