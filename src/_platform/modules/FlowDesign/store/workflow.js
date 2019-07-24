import createFetchAction from '../fetchAction';
import { base } from '../../../api';

export const getTemplate = createFetchAction(`{{Workflow_API}}/service/workflow/api/template/?status={{status}}`, []);

// 激活 与否
export const putTemplate = createFetchAction(`{{Workflow_API}}/service/workflow/api/template/{{id}}/status/`, [], 'PATCH');

export const postTemplate = createFetchAction(`{{Workflow_API}}/service/workflow/api/template/`, [], 'POST');
export const updateTemplate = createFetchAction(`{{Workflow_API}}/service/workflow/api/template/{{pk}}/`, [], 'delete');

export const getFlows = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/`, []);

export const createFlow = createFetchAction(`{{Workflow_API}}/service/workflow/api/instance/`, [],
    'POST');
export const addActor = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{ppk}}/state/{{pk}}/`, [], 'PUT');
export const commitFlow = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{pk}}/commit/`, [], 'PUT');
export const startFlow = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{pk}}/start/`, [], 'PUT');
export const putFlow = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{pk}}/logevent/`, [], 'POST');
export const entrustFlow = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{pk}}/delegate/`, [], 'POST');

export const getTask = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{task_id}}/`, []);

export const getWorkFlowList = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/?{{params}}`, []);

export const updateInstance = createFetchAction(
    `{{Workflow_API}}/service/workflow/api/instance/{{pk}}/subject/`, [], 'POST'
);

// 2019-7-22两库合并接口
// 获取流程列表
export const getflowList = createFetchAction(`{{Workflow_API}}/flow/flows`, []);
// 增加流程
export const postflow = createFetchAction(`{{Workflow_API}}/flow/flow`, [], 'POST');
// 编辑流程
export const putflowNew = createFetchAction(`{{Workflow_API}}/flow/flow`, [], 'PUT');
// 删除流程
export const deleteflow = createFetchAction(`${base}/flow/flow/{{ID}}`, [], 'DELETE');

export default {
    getflowList,
    postflow,
    putflowNew,
    deleteflow,

    getFlows,
    createFlow,
    addActor,
    commitFlow,
    startFlow,
    putFlow,
    entrustFlow,
    getTask,

    getWorkFlowList,
    updateInstance,

    getTemplate,
    postTemplate,
    updateTemplate
};
