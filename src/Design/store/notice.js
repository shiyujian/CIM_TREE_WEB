import {handleActions, combineActions,} from 'redux-actions';
import {actionsMap} from '_platform/store/util';

import fieldFactory from '_platform/store/service/field';
import listFactory from '_platform/store/service/list';

export const ID = 'DESIGN_NOTICE';

const parametersReducer = listFactory(ID, 'parameters');
const sidebarReducer = fieldFactory(ID, 'sidebar');
const approvalReducer = fieldFactory(ID, 'approval');

export const actions = {
	...parametersReducer,
	...sidebarReducer,
	...approvalReducer,
};

export default handleActions({
	[combineActions(...actionsMap(parametersReducer))]: (state, action) => ({
		...state,
		parameters: parametersReducer(state.parameters, action),
	}),
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(approvalReducer))]: (state, action) => ({
		...state,
		approval: approvalReducer(state.approval, action),
	}),
}, {});
