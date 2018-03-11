import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import { base } from '_platform/api';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';

const getLoginUser = createFetchAction(`${base}/accounts/api/users/{{id}}`, [], 'GET');
export const actions3 = {
	getLoginUser
};
export const ID = 'SYSTEM_USER';
export const getUserOK = createAction(`${ID}已关联用户`);
export const getUserFristPage = createAction(`${ID}显示所有用户的第一页`);
export const getUserFristData = createAction(`${ID}显示所有用户的第一页的数据`);
export const getUserLoading = createAction(`${ID}控制modal的loading`);

const memberReducer = fieldFactory(ID, 'member');
const additionReducer = fieldFactory(ID, 'addition');

export const actions = {
	...memberReducer,
	...additionReducer,
	getUserOK,
	getUserFristPage,
	getUserFristData,
	getUserLoading
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
	[getUserOK]: (state, { payload }) => ({
		...state,
		getUserList:payload,
	}),
	[getUserFristPage]: (state, { payload }) => ({
		...state,
		getUserFristPages:payload,
	}),
	[getUserFristData]: (state, { payload }) => ({
		...state,
		getUserFristDatas:payload,
	}),
	[getUserLoading]: (state, { payload }) => ({
		...state,
		getUserLoadings:payload,
	}),
}, {});
