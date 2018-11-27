import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {
    WORKFLOW_API,
    FOREST_API,
    USER_API,
    FILE_API
} from '_platform/api';
import { createFetchActionWithHeaders as myFetch } from './fetchAction';

const ID = 'ScheduleReport';

// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(
    `${WORKFLOW_API}/instance/{{id}}/`,
    [getWorkflowByIdOK],
    'GET'
);
// 获取选中树节点信息
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [
    getTreeOK
]);
export const gettreetype = createFetchAction(
    `${FOREST_API}/tree/treetypes`,
    []
);
export const getTaskSchedule = createFetchAction(
    `${WORKFLOW_API}/instance/?code={{code}}`
);

// 上传文件
export const postScheduleFile = myFetch(
    `${FILE_API}/api/user/files/`,
    [],
    'POST'
);

export const actions = {
    getWorkflowByIdOK,
    getWorkflowById,
    getTree,
    getTreeOK,
    gettreetype,
    getTaskSchedule,
    postScheduleFile
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
