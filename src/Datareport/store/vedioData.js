import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

const Test = createAction('测试redux');
//获取审核人
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
//发起流程
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST');
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');

export const actions = {
	Test,
	getAllUsers,
	createWorkflow,
	logWorkflowEvent
};

export default handleActions({
	[Test]: (state, {payload}) => ({
		...state,
		vedioTest:payload,
	}),
}, {});