import {handleActions, combineActions,} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import { base } from '_platform/api';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';

const getLoginUser = createFetchAction(`${base}/accounts/api/users/{{id}}`, [], 'GET');
export const actions3 = {
	getLoginUser
};
export const ID = 'SYSTEM_USER';

const memberReducer = fieldFactory(ID, 'member');
const additionReducer = fieldFactory(ID, 'addition');

export const actions = {
	...memberReducer,
	...additionReducer,
};

export default handleActions({
	[combineActions(...actionsMap(memberReducer))]: (state, action) => ({
		...state,
		member: memberReducer(state.member, action),
	}),
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
}, {});
