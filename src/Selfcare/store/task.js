import { combineActions, handleActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import createFetchAction from 'fetch-action';
import {
    base,
    WORKFLOW_API,
    TREE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
const ID = 'SELFCARE_TASK';
const parameterReducer = fieldFactory(ID, 'parameter');

export const setTaskDetailLoading = createAction(
    `${ID}_设置任务详情loading的值`
);
// 更改某个state的deadline
export const patchDeadline = createFetchAction(
    `${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`,
    [],
    'PATCH'
);
// 更改流程中存储的subject数据
export const postSubject = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/subject/`,
    [],
    'POST'
);
// 查看流程详情
export const getWorkflowById = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/`,
    [],
    'GET'
);
// 日进度存储
export const addSchedule = forestFetchAction(
    `${TREE_API}/progress`,
    [],
    'post'
);
// 周进度存储
export const postWeekPlanSchedule = forestFetchAction(
    `${TREE_API}/treedayplan`,
    [],
    'post'
);
export const gettreetype = forestFetchAction(
    `${TREE_API}/treetypesbyno`,
    []
);

const changeDocs = createAction(`${ID}_22CHANGE_DOCS`);
const selectDocuments = createAction(`${ID}_22SELECTDOUMENT`);
// 2019-7-27 两库合并
// 获取节点列表
export const getNodeList = createFetchAction(`${base}/flow/nodes`, []);
// 获取流程列表
export const getFlowList = createFetchAction(`${base}/flow/flows`, [], 'GET');
// 获取任务详情
export const getWorkDetails = createFetchAction(`${base}/flow/work/{{ID}}`, [], 'GET');
// 流程执行
export const postSendwork = createFetchAction(`${base}/flow/sendwork`, [], 'POST');
// 流程退回
export const postBackwork = createFetchAction(`${base}/flow/backwork`, [], 'POST');
export const actions = {
    getNodeList,
    getFlowList,
    getWorkDetails,
    postSendwork,
    postBackwork,
    ...parameterReducer,
    setTaskDetailLoading,
    patchDeadline,
    postSubject,
    getWorkflowById,
    addSchedule,
    postWeekPlanSchedule,
    changeDocs,
    selectDocuments,
    gettreetype
};

export default handleActions(
    {
        [setTaskDetailLoading]: (state, { payload }) => ({
            ...state,
            detailLoading: payload
        }),
        [changeDocs]: (state, { payload }) => ({
            ...state,
            docs: payload
        }),
        [selectDocuments]: (state, { payload }) => ({
            ...state,
            selected: payload
        }),
        [combineActions(...actionsMap(parameterReducer))]: (state, action) => ({
            ...state,
            parameter: parameterReducer(state.parameter, action)
        })
    },
    {}
);
