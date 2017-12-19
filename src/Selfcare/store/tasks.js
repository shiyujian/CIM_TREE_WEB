import {combineActions, handleActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {WORKFLOW_API} from '_platform/api';

const ID = 'SELFCARE_TASKS';

const filterReducer = fieldFactory(ID, 'filter');

export const setLoadingStatus = createAction(`${ID}_设置任务列表loading的值`);
export const setTablePage = createAction(`${ID}_设置任务列表Table的页数`);
export const getTasksList = createFetchAction(`${WORKFLOW_API}/template/?status=1`, [], 'GET');

export const actions = {
	...filterReducer,
	setLoadingStatus,
	setTablePage,
	getTasksList
};

export default handleActions({
	[setLoadingStatus]: (state, {payload}) => ({
		...state,
		loadingstatus: payload
	}),
	[setTablePage]: (state, {payload}) => ({
		...state,
		pagination: payload
	}),
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.field, action),
	}),
}, {});
