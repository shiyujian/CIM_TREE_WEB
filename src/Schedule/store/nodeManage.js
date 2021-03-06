import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {
    base,
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
// 2019-7-22 两库合并接口
// 获取任务详情
export const getWorkDetails = createFetchAction(`${base}/flow/work/{{ID}}`, []);
// 查询节点列表
export const getNodeList = createFetchAction(`${base}/flow/nodes`, []);
// 删除节点
export const deleteNode = createFetchAction(`${base}/flow/node/{{ID}}`, [], 'DELETE');
// 获取任务已办列表
export const getWorkList = createFetchAction(`${base}/flow/works`, []);
// 删除任务
export const deleteWork = createFetchAction(`${base}/flow/work/{{ID}}`, [], 'DELETE');
// 流程发起
export const postStartwork = createFetchAction(`${base}/flow/startwork`, [], 'POST');
// 节点表单列表
export const getNodefieldList = createFetchAction(`${base}/flow/nodefields`, []);
// 添加节点表单
export const postNodeform = createFetchAction(`${base}/flow/nodeform`, [], 'POST');
// 修改节点表单
export const putNodeform = createFetchAction(`${base}/flow/nodeform`, [], 'PUT');
// 删除节点表单
export const deleteNodeform = createFetchAction(`${base}/flow/nodeform/{{ID}}`, [], 'DELETE');
// 上传附件
export const uploadFileHandler = myFetch(`${base}/OSSUploadHandler.ashx?filetype=news`, [], 'POST');
export const actions = {
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
