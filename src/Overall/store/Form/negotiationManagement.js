import { handleActions, createAction } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from '../myfetchAction';
import {
    FLOW_API,
    OSSUPLOAD_API
} from '_platform/api';
export const ID = 'INTEGRATEDOFFICE_NEGOTIATIONMANAGEMENT';
// 洽商管理
const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
// 获取任务已办列表
export const getWorkList = createFetchAction(`${FLOW_API}/works`, []);
// 获取用户参与任务列表
export const getDoneWorkList = createFetchAction(`${FLOW_API}/doneworks`, [], 'GET');
// 获取任务详情
export const getWorkDetails = createFetchAction(`${FLOW_API}/work/{{ID}}`, []);
// 获取流程列表
export const getFlowList = createFetchAction(`${FLOW_API}/flows`, []);
// 获得节点列表
export const getNodeList = createFetchAction(`${FLOW_API}/nodes`, []);
// 流程发起
export const postStartwork = createFetchAction(`${FLOW_API}/startwork`, [], 'POST');
// 流程执行
export const postSendwork = createFetchAction(`${FLOW_API}/sendwork`, [], 'POST');
// 流程退回
export const postBackwork = createFetchAction(`${FLOW_API}/backwork`, [], 'POST');
// 删除任务
export const deleteWork = createFetchAction(`${FLOW_API}/work/{{ID}}`, [], 'DELETE');
// 流向查询列表
export const getDirectionList = createFetchAction(`${FLOW_API}/directions`, [], 'GET');
// 上传附件
export const uploadFileHandler = myFetch(`${OSSUPLOAD_API}?filetype=news`, [], 'POST');

export const actions = {
    deleteWork,
    getDirectionList,
    uploadFileHandler,
    postBackwork,
    postStartwork,
    postSendwork,
    getNodeList,
    getFlowList,
    getWorkDetails,
    getWorkList,
    getDoneWorkList,
    getTagsOK
};

export default handleActions(
    {
        [getTagsOK]: (state, { payload }) => ({
            ...state,
            tags: payload
        })
    },
    {}
);
