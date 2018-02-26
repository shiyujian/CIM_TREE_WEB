import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {FOREST_API} from '_platform/api';
export const ID = 'SYSTEM_PERSON';


const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const getTags = createFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [getTagsOK]);

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

export const actions = {
	...sidebarReducer,
	...additionReducer,
	...filterReducer,
	getTagsOK,
	getTags
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
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
	[getTagsOK]: (state, {payload}) => ({
		...state,
		tags: payload
	}),
}, {});
