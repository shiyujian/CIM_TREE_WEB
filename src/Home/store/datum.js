import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import { WORKFLOW_API } from '_platform/api';
const ID = 'home_datum';

export const getTaskPersonOK = createAction('获取个人任务');
// export const getTaskPerson = createFetchAction(`${WORKFLOW_API}/participant-task`, [getTaskPersonOK]);
export const getTaskPerson = createFetchAction(
    `${WORKFLOW_API}/participant-task?task=processing&executor={{userid}}&order_by=-real_start_time`,
    [getTaskPersonOK]
);
export const actions = {
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
