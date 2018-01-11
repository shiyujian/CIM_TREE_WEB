import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'receive';
export const getdocuemntlistOK = createAction(`${ID}_documentlist`);
export const getdocuemntlist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getdocuemntlistOK]);
export const setnewdocumentlist = createAction(`${ID}_setnewdocumentlist`);
export const Adding = createAction(`${ID}_Adding`);
export const changedoc = createAction(`${ID}_setdoc`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const leveledite = createAction(`${ID}_leveledite`);
export const seteditefile =createAction(`${ID}_seteditefile`);
export const changeeditedoc = createAction(`${ID}_changeeditedoc`);
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const edite  = createAction(`${ID}_edite`);
export const setedelfile = createAction(`${ID}_setedelfile`);
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');

export const actions = {
	getdocuemntlistOK,
	getdocuemntlist,
	setnewdocumentlist,
	changedoc,
	patchdocument,
	Adding,
	seteditefile,
	changeeditedoc,
	putdocument,
	edite,
	setedelfile,
	deletedocument
};

export default handleActions({
	[getdocuemntlistOK]: (state, {payload}) => ({
		...state,
		documentlist: payload
	}),
	[setnewdocumentlist]: (state, {payload}) => ({
		...state,
		newdocumentlist: payload
	}),
	[Adding]: (state, {payload}) => ({
		...state,
		AddVisible: payload
	}),
	[changedoc]: (state, {payload}) => ({
		...state,
		newdoc: payload
	}),
	[leveledite]: (state, {payload}) => ({
		...state,
		leveleditevisible: payload
	}),
	[seteditefile]: (state, {payload}) => ({
		...state,
		editefile: payload
	}),
	[changeeditedoc]: (state, {payload}) => ({
		...state,
		editefile: payload
	}),
	[edite]: (state, {payload}) => ({
		...state,
		editevisible: payload
	}),
	[setedelfile]: (state, {payload}) => ({
		...state,
		delfile: payload
	}),
}, {});
