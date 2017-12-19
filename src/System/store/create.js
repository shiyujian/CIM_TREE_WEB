import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API, CODE_PROJECT} from '_platform/api';

export const ID = 'SYSTEM_CREATE';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const connectReducer = fieldFactory(ID, 'connect');

const getFieldsOK = createAction(`${ID}_GET_FIELD_OK`);
const getFields = createFetchAction(`${CODE_API}/api/v1/dict-fields/`, [getFieldsOK]);
const deleteField = createFetchAction(`${CODE_API}/api/v1/dict-fields/details/?name={{name}}`, 'DELETE');

const getCodeGroupsOK = createAction(`${ID}_GET_CODE_GROUPS_OK`);
const getCodeGroupOK = createAction(`${ID}_GET_CODE_GROUP_OK`);
const getCodeGroups = createFetchAction(`${CODE_API}/api/v1/code-types/`, [getCodeGroupsOK]);
const getCodeGroupStructureOK = createAction(`${ID}_GET_CODE_GROUP_STRUCTURE_OK`);
const getCodeGroupStructure = createFetchAction(`${CODE_API}/api/v1/code-structs/details/`, [getCodeGroupStructureOK]);
const postCodeGroupStructure = createFetchAction(`${CODE_API}/api/v1/code-structs/`, 'POST');
const postCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/`, 'POST');
const getCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/details/`, [getCodeGroupOK]);
const deleteCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/details/?name={{name}}`, 'DELETE');


const getCodeTypesOK = createAction(`${ID}_GET_CODE_TYPES_OK`);
const getCodeTypeOK = createAction(`${ID}_GET_CODE_TYPE_OK`);
const getCodeTypes = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/?project=${CODE_PROJECT}`, [getCodeTypesOK]);
const postCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/?project=${CODE_PROJECT}`, 'POST');
const putCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}&name={{name}}`, 'PUT');
const getCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}`, [getCodeTypeOK]);
const deleteCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?name={{name}}`, 'DELETE');
const saveNameInde = createAction(`${ID}保存编码的name和inde`);

export const actions = {
	...sidebarReducer,
	...additionReducer,
	...connectReducer,
	getFieldsOK,
	getFields,
	deleteField,

	getCodeGroupsOK,
	getCodeGroups,
	getCodeGroupStructureOK,
	getCodeGroupStructure,
	postCodeGroupStructure,
	postCodeGroup,
	getCodeGroup,
	deleteCodeGroup,

	getCodeTypesOK,
	getCodeTypeOK,
	getCodeTypes,
	postCodeType,
	putCodeType,
	getCodeType,
	deleteCodeType,
	saveNameInde,

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
	[combineActions(...actionsMap(connectReducer))]: (state, action) => ({
		...state,
		connect: connectReducer(state.connect, action),
	}),
	[getFieldsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		fields: results
	}),
	[getCodeGroupsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		codeGroups: results
	}),
	[getCodeGroupStructureOK]: (state, {payload = {}}) => ({
		...state,
		codeGroupStructure: payload
	}),
	[getCodeTypesOK]: (state, {payload = {}}) => ({
		...state,
		codeTypes: payload
	}),
	[getCodeTypeOK]: (state, {payload = {}}) => ({
		...state,
		codeType: payload
	}),
	[saveNameInde]: (state, {payload}) => ({
		...state,
		nameInde: payload
	}),
	
}, {});
