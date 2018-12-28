import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {
    WORKFLOW_API
} from '_platform/api';
const ID = 'STAGE';

// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(
    `${WORKFLOW_API}/instance/{{id}}/`,
    [],
    'GET'
);
// 获取选中树节点信息
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const getTaskSchedule = createFetchAction(
    `${WORKFLOW_API}/instance/?code={{code}}`
);

export const actions = {
    getWorkflowByIdOK,
    getWorkflowById,
    getTreeOK,
    getTaskSchedule
};

export default handleActions(
    {
        [getTreeOK]: (state, { payload }) => {
            return {
                ...state,
                treeLists: [payload]
            };
        }
    },
    {}
);
