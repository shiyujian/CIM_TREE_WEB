import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'hazard';
export const getwplistOK = createAction(`${ID}_getwplistOK`);
export const getwplist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getwplistOK]);
export const gettaglistOK = createAction(`${ID}_gettaglistOK`);
export const gettaglist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [gettaglistOK]);
export const setnewwplist = createAction(`${ID}_setnewwplist`);
export const Adding = createAction(`${ID}_Add`);
export const setvalue = createAction(`${ID}_setvalue`);
export const setnewcode = createAction(`${ID}_setnewcode`);
export const changedoc = createAction(`${ID}_setdoc`);
export const leveledite = createAction(`${ID}_leveledite`);
export const seteditefile =createAction(`${ID}_seteditefile`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const changeeditedoc = createAction(`${ID}_changeeditedoc`);
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const setedelfile = createAction(`${ID}_setedelfile`);
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');
export const saveselectvalue = createAction(`${ID}_saveselectvalue`);
export const changeDocs = createAction(`${ID}_CHANGE_DOCS`);

export const actions = {
	saveselectvalue,
	getwplistOK,
	getwplist,
	setnewwplist,
	Adding,
	setnewcode,
	changedoc,
	patchdocument,
	leveledite,
	seteditefile,
	changeeditedoc,
	putdocument,
	setedelfile,
	deletedocument,
	gettaglistOK,
	gettaglist,
	setvalue,
	changeDocs
};

export default handleActions({
	[setvalue]: (state, {payload}) => ({
		...state,
		changevalue: payload
	}),
	[getwplistOK]: (state, {payload}) => ({
		...state,
		wplist: payload
	}),
	[gettaglistOK]: (state, {payload}) => ({
		...state,
		taglist: payload.metalist
	}),
	[setnewwplist]: (state, {payload}) => ({
		...state,
		newwplist: payload
	}),
	[Adding]: (state, {payload}) => ({
		...state,
		AddVisible: payload
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
		editefile: payload,
		extravalue:payload.extra
		// changevalue:payload.extra
	}),
	[changeeditedoc]: (state, {payload}) => ({
		...state,
		editefile: payload
	}),
	[setedelfile]: (state, {payload}) => ({
		...state,
		delfile: payload
	}),
	[saveselectvalue]: (state, {payload}) => ({
		...state,
		selectvalue: payload
	}),
	[changeDocs]: (state, {payload}) => ({
		...state,
		fileList: payload,
	}),
}, {});
