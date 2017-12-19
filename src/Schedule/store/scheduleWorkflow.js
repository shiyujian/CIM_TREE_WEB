import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {WORKFLOW_API,FILE_API,SERVICE_API,STATIC_UPLOAD_API,FDBSERVICE_API,EXCHANGE_API,USER_API} from '_platform/api';

import {createFetchActionWithHeaders as myFetch} from './fetchAction'

export const getScheduleWorkflowOK = createAction('获取总进度计划流程');
export const getScheduleWorkflow = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&executor={{userid}}&code={{code}}&subject_unit__contains={{pk}}&pagination=true&page_size=15`,[],'GET');

export const getStartWorkflowOK = createAction('获取发起计划流程');
export const getStartWorkflow = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}&status=2&pagination=true&page_size=15&page={{page}}`,[],'GET');

export const getReportWorkflowOK = createAction('获取进度填报流程');
export const getReportWorkflow = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&executor={{userid}}&code={{code}}&pagination=true&page_size=15&page={{page}}`,[],'GET');

export const getUnitWorkflowOK = createAction('获取单位工程发起过的流程');
export const getUnitWorkflow = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}&status=2&subject_unit__contains={{pk}}&pagination=true&page_size=15`,[],'GET');

export const getDelayReportWorkflowOK = createAction('获取单位工程发起的推迟填报流程');
export const getDelayReportWorkflow = createFetchAction(`${WORKFLOW_API}/instance/?status=2&code={{code}}&subject_unit__contains={{pk}}&pagination=true&page_size=15`,[],'GET');

export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');

export const getScheduleDirOK = createAction('获取文档目录');
export const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/`,[],'GET');

export const getDocumentOK = createAction('获取文档');
export const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[],'GET');


export const getTotalPlanTimeOK = createAction('获取总体进度的开始时间和完成时间');
export const getTotalPlanTime = createFetchAction(`${SERVICE_API}/project-time/{{pk}}/`,[],'GET');

export const getUnitPlanTimeOK = createAction('获取单位工程的开始时间和完成时间');
export const getUnitPlanTime = createFetchAction(`${SERVICE_API}/processdoc-time/code/{{code}}/`,[],'GET');

export const getNoticeWorkflowOK = createAction('获取流程警报信息');
export const getNoticeWorkflow = createFetchAction(`${WORKFLOW_API}/participant-task/?code={{code}}&pagination=true&state_deadline_lte={{date}}&pagination=true&page_size=15&page={{page}}`,[],'GET');

export const getOrgByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`,[],'GET');

const getEmployByOrgCodeOK = createAction('获取部门人员');
const getEmployByOrgCode = createFetchAction(`${USER_API}/users/`,[getEmployByOrgCodeOK]);

//上传文件
export const postScheduleFile = myFetch(`${FILE_API}/api/user/files/`,[],'POST');
//上传到静态服务
export const postScheduleModel = myFetch(`${STATIC_UPLOAD_API}/api/user/meta-files/`,[],'POST');
//解析excel表
export const analysisExcelFile = myFetch(`${SERVICE_API}/excel/upload-api/`,[],'POST');
//更改流程中存储的subject数据
export const postSubject = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/subject/`, [],'POST');
//更改某个state的deadline
export const patchDeadline = createFetchAction(`${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`, [],'PATCH');
//创建文档目录
export const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
//创建文档
export const postDocument = createFetchAction(`${SERVICE_API}/documents/`,[],'POST');
//修改文档
export const putDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[],'PUT');
//创建单位工程extra中的计划开始时间和计划结束时间
export const putScheduleTime = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`,[],'PUT');
//发送短信接口
export const sentMessageAc = createFetchAction(`${EXCHANGE_API}/api/v1/sms/`, [],"POST");

// 上传FDB到 FDBServer服务
export const postScheduleModelFDB = myFetch(`${FDBSERVICE_API}/fdb`, [], 'POST');

export const actions = {
    getWorkflowByIdOK,
    getWorkflowById,

    getStartWorkflowOK,
    getStartWorkflow,

    getReportWorkflowOK,
    getReportWorkflow,

    getUnitWorkflowOK,
    getUnitWorkflow,

    getScheduleWorkflowOK,
    getScheduleWorkflow,

    getDelayReportWorkflowOK,
    getDelayReportWorkflow,

    getScheduleDirOK,
    getScheduleDir,

    getDocumentOK,
    getDocument,

    getTotalPlanTimeOK,
    getTotalPlanTime,

    getUnitPlanTimeOK,
    getUnitPlanTime,

    getNoticeWorkflowOK,
    getNoticeWorkflow,

    getOrgByCode,

    getEmployByOrgCodeOK,
    getEmployByOrgCode,

    postScheduleFile,
    postScheduleModel,
    analysisExcelFile,
    postSubject,
    patchDeadline,
    postScheduleDir,
    postDocument,
    putScheduleTime,
    postScheduleModelFDB,
    putDocument,
    sentMessageAc,
    postScheduleModelFDB
    
};

export default handleActions({
    [getScheduleWorkflowOK]: (state, {payload}) => ({
        ...state,
        scheduleWorkflow: payload
    }),
    [getStartWorkflowOK]: (state, {payload}) => ({
        ...state,
        startWorkflow: payload
    }),
    [getUnitWorkflowOK]: (state, {payload}) => ({
        ...state,
        unitWorkflow: payload
    }),
    [getWorkflowByIdOK]: (state, {payload}) => ({
        ...state,
        workflowDetail: payload
    }),
    [getDelayReportWorkflowOK]: (state, {payload}) => ({
        ...state,
        delayReportWorkflow: payload
    }),
    [getScheduleDirOK]: (state, {payload}) => ({
        ...state,
        dir: payload
    }),
    [getNoticeWorkflowOK]: (state, {payload}) => ({
        ...state,
        noticeWorkflow: payload
    }),
    [getTotalPlanTimeOK]: (state, {payload}) => ({
        ...state,
        totalPlanTime: payload
    }),
    [getUnitPlanTimeOK]: (state, {payload}) => ({
        ...state,
        unitPlanTime: payload
    })
    
}, {});