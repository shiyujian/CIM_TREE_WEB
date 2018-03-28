import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {FOREST_API} from '_platform/api';
export const ID = 'SYSTEM_PERSON';


const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const setUpdate = createAction(`${ID}_LIST_UPDATE`);
const getSection = createAction(`${ID}_IS_SECTION`);
const getTreeModal = createAction(`${ID}设置树节点布尔值`);
const getTablePage = createAction(`${ID}table分页`);
const getTreeCode = createAction(`${ID}点击tree的节点code`);

const getTags = createFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [getTagsOK]);


const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

export const getListStore = createAction(`${ID}getListStore`);

export const actions = {
	...sidebarReducer,
	...additionReducer,
	...filterReducer,
	getTagsOK,
	getTags,
	getTreeModal,
	setUpdate,
	getSection,
	getListStore,
	getTablePage,
	getTreeCode
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
	[setUpdate]: (state, {payload}) => ({
		...state,
		isUpdate: payload
	}),
	[getSection]: (state, {payload}) => ({
		...state,
		isSection: payload
	}),
	[getTreeModal]: (state, {payload}) => ({
		...state,
		getTreeModals: payload
	}),
	[getListStore]: (state, {payload}) => ({
		...state,
		listStore: payload
	}),
	[getTablePage]: (state, {payload}) => ({
		...state,
		getTablePages: payload
	}),
	[getTreeCode]: (state, {payload}) => ({
		...state,
		getTreeCodes: payload
	}),
}, {});
