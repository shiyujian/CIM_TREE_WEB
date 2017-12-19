import {combineActions, handleActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';

import fieldFactory from '_platform/store/service/field';

const ID = 'DESIGN_MONITOR';

const filterReducer = fieldFactory(ID, 'filter');

export const actions = {
	...filterReducer,
};


export default handleActions({
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.filter, action),
	}),
}, {});