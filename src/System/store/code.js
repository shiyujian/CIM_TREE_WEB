import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API, CODE_PROJECT} from '_platform/api';

export const ID = 'SYSTEM_CODE';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');

const getCodeGroupsOK = createAction(`${ID}_GET_CODE_GROUPS_OK`);
const getCodeGroups = createFetchAction(`${CODE_API}/api/v1/code-types/`, [getCodeGroupsOK]);
const getCodeGroupStructureOK = createAction(`${ID}_GET_CODE_GROUP_STRUCTURE_OK`);
const getCodeGroupStructure = createFetchAction(`${CODE_API}/api/v1/code-structs/details/`, [getCodeGroupStructureOK]);
const postCodeGroupStructure = createFetchAction(`${CODE_API}/api/v1/code-structs/`, 'POST');
const deleteCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/details/?name={{name}}`, 'DELETE');
const putCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/details/?name={{name}}`, 'PUT');

const getCodeTypesOK = createAction(`${ID}_GET_CODE_TYPES_OK`);
const getCodeTypeOK = createAction(`${ID}_GET_CODE_TYPE_OK`);
const getCodeTypes = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/?project=${CODE_PROJECT}`, [getCodeTypesOK]);
const postCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/?project=${CODE_PROJECT}`, 'POST');
const putCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}&name={{name}}`, 'PUT');
const getCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}`, [getCodeTypeOK]);
const deleteCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}&name={{name}}`, 'DELETE');

export const actions = {
	...sidebarReducer,
	...additionReducer,

	getCodeGroupsOK,
	getCodeGroups,
	getCodeGroupStructureOK,
	getCodeGroupStructure,
	postCodeGroupStructure,
	deleteCodeGroup,
	putCodeGroup,

	getCodeTypesOK,
	getCodeTypeOK,
	getCodeTypes,
	postCodeType,
	putCodeType,
	getCodeType,
	deleteCodeType
};

export default handleActions({
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
	[getCodeGroupsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		codeGroups: results
	}),
	[getCodeGroupStructureOK]: (state, {payload = {}}) => ({
		...state,
		codeGroupStructure: payload
	}),
	[getCodeTypesOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		codeTypes: results
	}),
	[getCodeTypeOK]: (state, {payload = {}}) => ({
		...state,
		codeType: payload
	})
}, {});
