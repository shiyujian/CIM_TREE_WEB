import { handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {base} from '_platform/api';
const getLoginUser = createFetchAction(`${base}/accounts/api/users/{{id}}`, [], 'GET');
export const actions2 = {
	getLoginUser
};
export const ID = 'SYSTEM_PROJECT';

const tableReducer = fieldFactory(ID, 'table');

export const actions = {
	...tableReducer,
};

export default handleActions({
	[combineActions(...actionsMap(tableReducer))]: (state, action) => ({
		...state,
		table: tableReducer(state.table, action),
	}),
}, {});
