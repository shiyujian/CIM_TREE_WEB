import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {
    FLOW_API,
    WORKFLOW_API,
    OSSUPLOAD_API
} from '_platform/api';
const ID = 'Project_STAGE';

// 流程节点
export const getTreeOK = createAction(`${ID}_getTreeOK`);
// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(
    `${WORKFLOW_API}/instance/{{id}}/`,
    [],
    'GET'
);
export const getTaskSchedule = createFetchAction(
    `${WORKFLOW_API}/instance/?code={{code}}`
);
// 2019-7-22 两库合并接口
// 获取任务详情
export const getWorkDetails = createFetchAction(`${FLOW_API}/work/{{ID}}`, []);
// 查询节点列表
export const getNodeList = createFetchAction(`${FLOW_API}/nodes`, []);
// 删除节点
export const deleteNode = createFetchAction(`${FLOW_API}/node/{{ID}}`, [], 'DELETE');
// 获取任务已办列表
export const getWorkList = createFetchAction(`${FLOW_API}/works`, []);
// 删除任务
export const deleteWork = createFetchAction(`${FLOW_API}/work/{{ID}}`, [], 'DELETE');
// 流程发起
export const postStartwork = createFetchAction(`${FLOW_API}/startwork`, [], 'POST');
// 节点表单列表
export const getNodefieldList = createFetchAction(`${FLOW_API}/nodefields`, []);
// 新增节点表单字段
export const postNodefield = createFetchAction(`${FLOW_API}/nodefields`, [], 'POST');
// 删除节点表单字段
export const deleteNodefield = createFetchAction(`${FLOW_API}/nodefield/{{ID}}`, [], 'DELETE');
// 添加节点表单
export const postNodeform = createFetchAction(`${FLOW_API}/nodeform`, [], 'POST');
// 修改节点表单
export const putNodeform = createFetchAction(`${FLOW_API}/nodeform`, [], 'PUT');
// 删除节点表单
export const deleteNodeform = createFetchAction(`${FLOW_API}/nodeform/{{ID}}`, [], 'DELETE');
// 上传附件
export const uploadFileHandler = myFetch(`${OSSUPLOAD_API}?filetype=news`, [], 'POST');
export const actions = {
    postNodefield,
    deleteNodefield,
    getWorkDetails,
    getNodeList,
    deleteNode,
    getWorkList,
    deleteWork,
    postStartwork,
    getNodefieldList,
    postNodeform,
    putNodeform,
    deleteNodeform,
    uploadFileHandler,

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
