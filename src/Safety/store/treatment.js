import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API} from '_platform/api';
import {SERVICE_API} from '_platform/api';

export const ID = 'TREATMENT';

//获取树
export const getTreeOK = createAction('${ID}_获取项目结构树')
export const getTree =
	createFetchAction(`${SERVICE_API}/project-tree/?depth=3`,[getTreeOK]);

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');

const getCodeTypesOK = createAction(`${ID}_GET_CODE_TYPES_OK`);
const getCodeTypes = createFetchAction(`${CODE_API}/api/v1/dict-types/`, [getCodeTypesOK]);

export const actions = {
	getTreeOK,
	getTree,
	...sidebarReducer,
	...additionReducer,
	getCodeTypes,
	getCodeTypesOK
};

export default handleActions({
	[getTreeOK]: (state, {payload: {children}}) => ({
		...state,
		tree: children
	}),
	
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
	[getCodeTypesOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		codeTypes: results
	})
}, {});
