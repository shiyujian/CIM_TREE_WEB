import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

const Test = createAction('测试redux');
//获取审核人
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);

export const actions = {
	Test,
	getAllUsers
};

export default handleActions({
	[Test]: (state, {payload}) => ({
		...state,
		vedioTest:payload,
	}),
}, {});