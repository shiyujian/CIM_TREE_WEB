import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

export const Test = createAction('测试redux');
export const actions = {
	Test
};

export default handleActions({
	[Test]: (state, {payload}) => ({
		...state,
		vedioTest:payload,
	}),
}, {});