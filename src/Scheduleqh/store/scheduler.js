import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import {WORKFLOW_API} from '_platform/api';
import fieldFactory from '_platform/store/service/field';
import {base,SERVICE_API,USER_API} from '_platform/api';


const setSchedulerData1 = createAction ('进度管理-设置日程值1');
const getUserByID = createFetchAction(`${USER_API}/users/{{pk}}`,[],'GET');
const getScheduleWorkFlow = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&executor=20&code={{code}}&subject_date__contains={{date}}&pagination=true&page_size=15`,[],'GET');
const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
const postScheduler = createFetchAction(`${base}/service/appserver/agendas/`,[],'POST');
const getScheduler = createFetchAction(`${base}/service/appserver/agendas/`,[],'GET');
const getOrgByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`,[],'GET');
const getEmployByOrgCodeOK = createAction('获取部门人员');
const getEmployByOrgCode = createFetchAction(`${USER_API}/users/`,[getEmployByOrgCodeOK]);
const updateSchedulerState = createFetchAction(`${base}/service/appserver/agenda/{{pk}}/`,[],'PATCH');
const correlateSchedulerAndWorkflow = createFetchAction(`${base}/service/appserver/agenda/{{pk}}/`,[],'POST');
const putScheduleTable = createFetchAction(`${base}/service/appserver/agenda/{{pk}}/`,[],'PATCH');
const patchDeadline = createFetchAction(`${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`, [],'PATCH');
const postSubject = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/subject/`, [],'POST');
const reportMember = createAction('选择填报人');
const approvalMember = createAction('选择审核人');
export const getDocumentOK = createAction('获取文档');
export const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[],'GET');
//创建单位工程extra中的进度任务
//修改文档
export const putDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[],'PUT');
export const putProcessData = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`,[],'PUT');
//创建单位工程extra中的进度任务
export const getProcessData = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`,[],'GET');


export const actions = {
    setSchedulerData1,
    getUserByID,
    getScheduleWorkFlow,
    getWorkflowById,
    postScheduler,
    getScheduler,
    getOrgByCode,
    getEmployByOrgCodeOK,
    getEmployByOrgCode,
    updateSchedulerState,
    correlateSchedulerAndWorkflow,
    putScheduleTable,
    patchDeadline,
    postSubject,
    reportMember,
    approvalMember,
    getDocumentOK,
    getDocument,
    putDocument,
    putProcessData,
    getProcessData
};

export default handleActions({
    [reportMember]:(state,{payload}) => {
        return {
            ...state,
            reportMember: payload
        }
    },
    [approvalMember]:(state,{payload}) => {
        return {
            ...state,
            approvalMember: payload
        }
    },
    [setSchedulerData1]:(state,{payload}) => {
        return {
            ...state,
            datas1: payload
        }
    },
    [getEmployByOrgCodeOK]: (state, {payload}) => {
        return{
            ...state,
            ORGMember: payload
        }
    }
}, {});
