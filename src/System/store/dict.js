import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API} from '_platform/api';

export const ID = 'SYSTEM_DICT';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const dictcreateReducer = fieldFactory(ID, 'dictcreate');

const getFieldsOK = createAction(`${ID}_GET_FIELD_OK`);
const getSystemFieldsOK = createAction(`${ID}_GET_SYSTEM_FIELD_OK`);
const getDictValuesOK = createAction(`${ID}_GET_DICT_VALUE_OK`);
const setFieldName = createAction(`${ID}_SET_FIELD_NAME_OK`);
const setDictLoading = createAction(`${ID}_SET_DICT_LOADING_OK`);


const getFields = createFetchAction(`${CODE_API}/api/v1/dict-fields/?per_page=100`, [getFieldsOK]);
const getSystemFields = createFetchAction(`${CODE_API}/api/v1/dict-fields/?system_owned=true&per_page=100`, [getSystemFieldsOK]);
const getDictValues = createFetchAction(`${CODE_API}/api/v1/dict-values/public/`, [getDictValuesOK]);


const postDictValues = createFetchAction(`${CODE_API}/api/v1/dict-values/public/`,[],'POST');
const postFields = createFetchAction(`${CODE_API}/api/v1/dict-fields/`,[], 'POST');


const patchDictValue = createFetchAction(`${CODE_API}/api/v1/dict-values/details/public/?dict_field={{dict_field}}&value={{value}}`, [],'PATCH');


const deleteField = createFetchAction(`${CODE_API}/api/v1/dict-fields/details/?name={{name}}`,[], 'DELETE');
const deleteDictValue = createFetchAction(`${CODE_API}/api/v1/dict-values/details/public/?dict_field={{dict_field}}&value={{value}}`, [],'DELETE');

export const actions = {
	...sidebarReducer,
	...additionReducer,
	...dictcreateReducer,
	getFieldsOK,
	getSystemFieldsOK,
	getDictValuesOK,
	setFieldName,
	setDictLoading,
	getFields,
	getSystemFields,
	getDictValues,
	postDictValues,
	postFields,
	patchDictValue,
	deleteField,
	deleteDictValue
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
	[combineActions(...actionsMap(dictcreateReducer))]: (state, action) => ({
		...state,
		dictcreate: dictcreateReducer(state.dictcreate, action),
	}),
	[getFieldsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		fields: results
	}),
	[getSystemFieldsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		systemFields: results
	}),
	[getDictValuesOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		dictValues: results
	}),
	[setFieldName]: (state, {payload}) => ({
		...state,
		fieldname: payload
	}),
	[setDictLoading]: (state, {payload}) => ({
		...state,
		dictloading: payload
	}),
}, {});
