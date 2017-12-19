import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {WORKFLOW_API,FILE_API,SERVICE_API,STATIC_UPLOAD_API} from '_platform/api';


export const getTotalReportOverdueOK = createAction('获取总进度计划填报逾期任务统计');
export const getTotalReportOverdue = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=START&subject_unit__contains={{pk}}&state_deadline_lte={{date}}&pagination=true&page_size=1&page=1`,[],'GET');


export const getTotalReportAllOK = createAction('获取总进度计划填报所有任务统计');
export const getTotalReportAll = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=START&subject_unit__contains={{pk}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getTotalApprovalOverdueOK = createAction('获取总进度计划审批逾期任务统计');
export const getTotalApprovalOverdue = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=STATE02&subject_unit__contains={{pk}}&state_deadline_lte={{date}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getTotalApprovalAllOK = createAction('获取总进度计划审批所有任务统计');
export const getTotalApprovalAll = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=STATE02&subject_unit__contains={{pk}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getStageReportOverdueOK = createAction('获取进度管控填报逾期任务统计');
export const getStageReportOverdue = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=START&subject_unit__contains={{pk}}&state_deadline_lte={{date}}&pagination=true&page_size=1&page=1`,[],'GET');


export const getStageReportAllOK = createAction('获取进度管控填报所有任务统计');
export const getStageReportAll = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=START&subject_unit__contains={{pk}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getStageApprovalOverdueOK = createAction('获取进度管控审批逾期任务统计');
export const getStageApprovalOverdue = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=STATE02&subject_unit__contains={{pk}}&state_deadline_lte={{date}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getStageApprovalAllOK = createAction('获取进度管控审批所有任务统计');
export const getStageApprovalAll = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=STATE02&subject_unit__contains={{pk}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getTaskOK = createAction('获取进度任务统计');
export const getTask = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&state_code=STATE02&subject_unit__contains={{pk}}&state_deadline_lte={{date}}&pagination=true&page_size=1&page=1`,[],'GET');

export const getProjectProcessOK = createAction('获取进度任务逾期按期统计');
export const getProjectProcess = createFetchAction(`${SERVICE_API}/project-process/{{pk}}/`,[],'GET');

export const getProjectQuantityOK = createAction('获取单位工程完成状态统计');
export const getProjectQuantity = createFetchAction(`${SERVICE_API}/project-quantity/{{pk}}/`,[],'GET');


export const actions = {
    getTotalReportOverdueOK,
    getTotalReportOverdue,

    getTotalReportAllOK,
    getTotalReportAll,

    getTotalApprovalOverdueOK,
    getTotalApprovalOverdue,

    getTotalApprovalAllOK,
    getTotalApprovalAll,

    getStageReportOverdueOK,
    getStageReportOverdue,

    getStageReportAllOK,
    getStageReportAll,

    getStageApprovalOverdueOK,
    getStageApprovalOverdue,

    getStageApprovalAllOK,
    getStageApprovalAll,

    getTaskOK,
    getTask,

    getProjectProcessOK,
    getProjectProcess,

    getProjectQuantityOK,
    getProjectQuantity
};

export default handleActions({
    [getTotalReportOverdueOK]: (state, {payload}) => ({
        ...state,
        totalReportOverdue: payload
    }),
    [getTotalReportAllOK]: (state, {payload}) => ({
        ...state,
        totalReportAll: payload
    }),
    [getTotalApprovalOverdueOK]: (state, {payload}) => ({
        ...state,
        totalApprovalOverdue: payload
    }),
    [getTotalApprovalAllOK]: (state, {payload}) => ({
        ...state,
        totalApprovalAll: payload
    }),
    [getStageReportOverdueOK]: (state, {payload}) => ({
        ...state,
        stageReportOverdue: payload
    }),
    [getStageReportAllOK]: (state, {payload}) => ({
        ...state,
        stageReportAll: payload
    }),
    [getStageApprovalOverdueOK]: (state, {payload}) => ({
        ...state,
        stageApprovalOverdue: payload
    }),
    [getStageApprovalAllOK]: (state, {payload}) => ({
        ...state,
        stageApprovalAll: payload
    }),
    [getTaskOK]: (state, {payload}) => ({
        ...state,
        workflowDetail: payload
    }),
    [getProjectProcessOK]: (state, {payload}) => ({
        ...state,
        projectProcess: payload
    }),
    [getProjectQuantityOK]: (state, {payload}) => ({
        ...state,
        projectQuantity: payload
    })
}, {});