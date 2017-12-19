import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API, CODE_PROJECT} from '_platform/api';

export const ID = 'SYSTEM_CONVENTION';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const groupReducer = fieldFactory(ID, 'group');
const importedReducer = fieldFactory(ID, 'imported');
const dataobjectReducer = fieldFactory(ID, 'dataobject');

const getFieldsOK = createAction(`${ID}_GET_FIELD_OK`);
const getFields = createFetchAction(`${CODE_API}/api/v1/dict-fields/`, [getFieldsOK]);
const deleteField = createFetchAction(`${CODE_API}/api/v1/dict-fields/details/?name={{name}}`, 'DELETE');
const getFieldValuesOK = createAction(`${ID}_GET_FIELD_VALUES_OK`);
const getFieldValues = createFetchAction(`${CODE_API}/api/v1/dict-values/public/`, [getFieldValuesOK]);
const postFieldValues = createFetchAction(`${CODE_API}/api/v1/dict-values/public/`,[], 'POST');


const getCodeGroupsOK = createAction(`${ID}_GET_CODE_GROUPS_OK`);
const getCodeGroups = createFetchAction(`${CODE_API}/api/v1/code-types/`, [getCodeGroupsOK]);
const getCodeGroupStructureOK = createAction(`${ID}_GET_CODE_GROUP_STRUCTURE_OK`);
const getCodeGroupStructure = createFetchAction(`${CODE_API}/api/v1/code-structs/details/`, [getCodeGroupStructureOK]);
const postCodeGroupStructure = createFetchAction(`${CODE_API}/api/v1/code-structs/`,[], 'POST');
const postCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/`, [], 'POST');
const deleteCodeGroup = createFetchAction(`${CODE_API}/api/v1/code-types/details/?name={{name}}`, [], 'DELETE');


const getCodeTypesOK = createAction(`${ID}_GET_CODE_TYPES_OK`);
const getCodeTypeOK = createAction(`${ID}_GET_CODE_TYPE_OK`);
const getCodeTypes = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/?project=${CODE_PROJECT}&per_page=100`, [getCodeTypesOK]);
const postCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/?project=${CODE_PROJECT}`,[], 'POST');
const putCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}&name={{name}}`, [], 'PUT');
const getCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?project=${CODE_PROJECT}`, [getCodeTypeOK]);
const deleteCodeType = createFetchAction(`${CODE_API}/api/v1/projects/codetypes/details/?name={{name}}`, 'DELETE');


const getGroupFieldsOK = createAction(`${ID}_GET_GROUP_FIELDS_OK`);
const getGroupFields = createFetchAction(`${CODE_API}/api/v1/code-structs/details/fields/`, [getGroupFieldsOK]);
const getGroupsOK = createAction(`${ID}_GET_GROUPS_OK`);
const getGroups = createFetchAction(`${CODE_API}/api/v1/code-structs/details/groups/`, [getGroupsOK]);


const getProjectFieldValuesOK = createAction(`${ID}_GET_PROJECT_FIELD_VALUES_OK`);
const getProjectFieldValues = createFetchAction(`${CODE_API}/api/v1/dict-values/project/`, [getProjectFieldValuesOK]);
const postProjectFieldValue = createFetchAction(`${CODE_API}/api/v1/dict-values/project/`,[], 'POST');
const getProjectCodesOK = createAction(`${ID}_GET_PROJECT_CODE_OK`);
const getProjectCodes = createFetchAction(`${CODE_API}/api/v1/projects/code/`, [getProjectCodesOK]);
const postProjectCode = createFetchAction(`${CODE_API}/api/v1/projects/code/`,[], 'POST');
const patchProjectFieldValue = createFetchAction(`${CODE_API}/api/v1/dict-values/details/project/?project=${CODE_PROJECT}&dict_field={{dict_field_name}}&value={{value}}`, [],'PATCH');
const deleteProjectFieldValue = createFetchAction(`${CODE_API}/api/v1/dict-values/details/project/?project=${CODE_PROJECT}&dict_field={{dict_field_name}}&value={{value}}`, [],'DELETE');
const patchProjectCode = createFetchAction(`${CODE_API}/api/v1/projects/code/details/?project=${CODE_PROJECT}&code_type={{code_type}}&full_code={{full_code}}`,[], 'PATCH');
const deleteProjectCode = createFetchAction(`${CODE_API}/api/v1/projects/code/details/?project=${CODE_PROJECT}&code_type={{code_type}}&full_code={{full_code}}`,[], 'DELETE');

export const actions = {
	...sidebarReducer,
	...additionReducer,
	...groupReducer,
	...importedReducer,
	...dataobjectReducer,
	getFieldsOK,
	getFields,
	deleteField,
	getFieldValuesOK,
	getFieldValues,
	postFieldValues,

	getCodeGroupsOK,
	getCodeGroups,
	getCodeGroupStructureOK,
	getCodeGroupStructure,
	postCodeGroupStructure,
	postCodeGroup,
	deleteCodeGroup,

	getCodeTypesOK,
	getCodeTypeOK,
	getCodeTypes,
	postCodeType,
	putCodeType,
	getCodeType,
	deleteCodeType,

	getGroupFieldsOK,
	getGroupFields,
	getGroupsOK,
	getGroups,

	getProjectFieldValuesOK,
	getProjectFieldValues,
	postProjectFieldValue,
	getProjectCodesOK,
	getProjectCodes,
	postProjectCode,
	patchProjectFieldValue,
	deleteProjectFieldValue,
	patchProjectCode,
	deleteProjectCode,
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
	[combineActions(...actionsMap(groupReducer))]: (state, action) => ({
		...state,
		group: groupReducer(state.group, action),
	}),
	[combineActions(...actionsMap(importedReducer))]: (state, action) => ({
		...state,
		imported: importedReducer(state.imported, action),
	}),
	[combineActions(...actionsMap(dataobjectReducer))]: (state, action) => ({
		...state,
		dataobject: dataobjectReducer(state.dataobject, action),
	}),
	[getFieldsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		fields: results
	}),
	[getFieldValuesOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		dictValues: results.map((item, index) => {
			item.index = index + 1;
			return item
		})
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
	}),
	[getGroupFieldsOK]: (state, {payload: {fields = []} = {}}) => ({
		...state,
		groupFields: fields
	}),
	[getGroupsOK]: (state, {payload: {code_groups = []} = {}}) => ({
		...state,
		groups: code_groups
	}),
	[getProjectFieldValuesOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		projectFieldValues: results.map((item, index) => {
			item.index = index + 1;
			return item
		})
	}),
	[getProjectCodesOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		projectCodes: results.map((item, index) => {
			item.index = index + 1;
			return item
		})
	})
}, {});
