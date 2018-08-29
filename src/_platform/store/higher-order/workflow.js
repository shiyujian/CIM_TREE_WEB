import createFetchAction from 'fetch-action';
import { WORKFLOW_API } from '../../api';

export const createFlow = createFetchAction(
    `${WORKFLOW_API}/instance/`,
    'POST'
);
export const addActor = createFetchAction(
    `${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`,
    'PUT'
);
export const commitFlow = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/commit/`,
    'PUT'
);
export const startFlow = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/start/`,
    'PUT'
);
export const putFlow = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/logevent/`,
    'POST'
);

export const abolishFlow = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/abolish/`,
    [],
    'POST'
);
export const delegateFlow = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/delegate/`,
    [],
    'POST'
);
export const carbonCopy = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/carbon-copy/`,
    [],
    'POST'
);
export const getWorkflowTemplate = createFetchAction(
    `${WORKFLOW_API}/template/code/{{code}}/`,
    [],
    'GET'
);
export const deleteFlow = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/`,
    'DELETE'
);

export default {
    createFlow,
    addActor,
    commitFlow,
    startFlow,
    putFlow,
    abolishFlow,
    delegateFlow,
    carbonCopy,
    getWorkflowTemplate,
    deleteFlow
};
