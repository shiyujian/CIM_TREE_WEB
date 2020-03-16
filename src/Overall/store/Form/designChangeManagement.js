import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    MEETING_API,
    FLOW_API,
    OSSUPLOAD_API
} from '_platform/api';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from '../myfetchAction';
export const ID = 'INTEGRATEDOFFICE_DESIGNCHANGE';

// 会议列表
export const getMeetingList = createFetchAction(`${MEETING_API}/meetings`, [], 'GET');

// 获取流程列表
export const getFlowList = createFetchAction(`${FLOW_API}/flows`, []);
// 根据id获取流程详情
export const getWorkflowById = createFetchAction(`${FLOW_API}/flow/{{id}}/`,[],'GET');
// 根据no获取流程详情
export const getWorkflowByNo = createFetchAction(`${FLOW_API}/flowbyno?no={{No}}/`,[],'GET');
// 获取任务待办列表
export const getWorkList = createFetchAction(`${FLOW_API}/works`, []);
// 获取任务已办列表
export const getDoneWorkList = createFetchAction(`${FLOW_API}/doneworks`, [], 'GET');
// 获取任务详情
export const getWorkDetails = createFetchAction(`${FLOW_API}/work/{{ID}}`, []);
// 获取节点
export const getNodeList = createFetchAction(`${FLOW_API}/nodes`, []);
// 删除任务
export const deleteWork = createFetchAction(`${FLOW_API}/work/{{ID}}`, [], 'DELETE');
// 流程发起
export const postStartwork = createFetchAction(`${FLOW_API}/startwork`, [], 'POST');
// 流程执行
export const postSendwork = createFetchAction(`${FLOW_API}/sendwork`, [], 'POST');
// 流程退回
export const postBackwork = createFetchAction(`${FLOW_API}/backwork`, [], 'POST');
// 流向查询列表
export const getDirectionList = createFetchAction(`${FLOW_API}/directions`, [], 'GET');
// // 节点表单列表
// export const getNodefieldList = createFetchAction(`${FLOW_API}/nodefields`, []);
// // 添加节点表单字段
// export const postNodefields = createFetchAction(`${FLOW_API}/nodefields`, [], 'POST');
// // 添加节点表单字段
// export const putNodefields = createFetchAction(`${FLOW_API}/nodefields`, [], 'PUT');
// // 删除节点表单字段
// export const deleteNodefields = createFetchAction(`${FLOW_API}/nodefields/{{ID}}`, [], 'DELETE');
// 上传附件
export const uploadFileHandler = myFetch(`${OSSUPLOAD_API}?filetype=news`, [], 'POST');

export const actions = {
    getMeetingList,
    getFlowList,
    getWorkflowById,
    getWorkflowByNo,
    getWorkList,
    getDoneWorkList,
    getWorkDetails,
    getNodeList,
    deleteWork,
    postStartwork,
    postSendwork,
    postBackwork,
    // getNodefieldList,
    // postNodefields,
    // putNodefields,
    // deleteNodefields,
    getDirectionList,
    uploadFileHandler
};

export default handleActions({

},{});
