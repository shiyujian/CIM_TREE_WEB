import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field'
import listFactory from '_platform/store/service/list'

export const ID = 'QUALITY_ITEM';
const sidebarReducer = fieldFactory(ID, 'sidebar');
const filterReducer = fieldFactory(ID, 'filter');
const tableReducer = fieldFactory(ID, 'table');
const approvalReducer = fieldFactory(ID, 'approval');
const parametersReducer = listFactory(ID, 'parameters');

export const actions = {
	...sidebarReducer,
	...filterReducer,
	...tableReducer,
	...approvalReducer,
	...parametersReducer,
};

export default handleActions({
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.filter, action),
	}),
	[combineActions(...actionsMap(tableReducer))]: (state, action) => ({
		...state,
		table: tableReducer(state.table, action),
	}),
	[combineActions(...actionsMap(parametersReducer))]: (state, action) => ({
		...state,
		parameters: parametersReducer(state.parameters, action),
	}),
	[combineActions(...actionsMap(approvalReducer))]: (state, action) => ({
		...state,
		approval: approvalReducer(state.approval, action),
	}),
}, {});
