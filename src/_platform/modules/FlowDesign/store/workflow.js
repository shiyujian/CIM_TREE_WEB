import createFetchAction from '../fetchAction';


export const getTemplate = createFetchAction(`{{Workflow_API}}/service/workflow/api/template/?status={{status}}`, []);

// 激活 与否
export const putTemplate =  createFetchAction(`{{Workflow_API}}/service/workflow/api/template/{{id}}/status/`, [], 'PATCH');

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

export default {
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