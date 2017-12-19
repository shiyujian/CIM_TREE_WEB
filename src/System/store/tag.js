import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'tag';
export const gettaglistOK = createAction(`${ID}_taglist`);
export const gettaglist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [gettaglistOK]);
export const setnewtaglist = createAction(`${ID}_setnewtaglist`);
export const levelAdding = createAction(`${ID}_levelAdd`);
export const setnewcode = createAction(`${ID}_setnewcode`);
export const changedoc = createAction(`${ID}_setdoc`);
export const leveledite = createAction(`${ID}_leveledite`);
export const seteditefile =createAction(`${ID}_seteditefile`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const changeeditedoc = createAction(`${ID}_changeeditedoc`);
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const setedelfile = createAction(`${ID}_setedelfile`);
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');
export const Adding = createAction(`${ID}_Adding`);
export const changeDocs = createAction(`${ID}_CHANGE_DOCS`);

export const actions = {
	gettaglistOK,
	gettaglist,
	setnewtaglist,
	levelAdding,
	setnewcode,
	changedoc,
	patchdocument,
	leveledite,
	seteditefile,
	changeeditedoc,
	putdocument,
	setedelfile,
	deletedocument,
	Adding,
	changeDocs,
};

export default handleActions({
	[gettaglistOK]: (state, {payload}) => ({
		...state,
		taglist: payload
	}),
	[setnewtaglist]: (state, {payload}) => ({
		...state,
		newtaglist: payload
	}),
	[levelAdding]: (state, {payload}) => ({
		...state,
		levelAddVisible: payload
	}),
	[setnewcode]: (state, {payload}) => ({
		...state,
		newcoded: payload
	}),
	[changedoc]: (state, {payload}) => ({
		...state,
		newdoc: payload
	}),
	[leveledite]: (state, {payload}) => ({
		...state,
		editevisible: payload
	}),
	[seteditefile]: (state, {payload}) => ({
		...state,
		editefile: payload
	}),
	[changeeditedoc]: (state, {payload}) => ({
		...state,
		editefile: payload
	}),
	[setedelfile]: (state, {payload}) => ({
		...state,
		delfile: payload
	}),
	[Adding]: (state, {payload}) => ({
		...state,
		AddVisible: payload
	}),
	[changeDocs]: (state, {payload}) => ({
		...state,
		fileList: payload,
	}),
}, {});
