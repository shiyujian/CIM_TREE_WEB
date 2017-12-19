import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'accident';
export const getaccidentlevellistOK = createAction(`${ID}_wxlist`);
export const getaccidentlevellist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getaccidentlevellistOK]);
export const setnewaccidentlevellist = createAction(`${ID}_setnewhiddenlist`);
export const getaccidentlistOK = createAction(`${ID}_wxlist`);
export const getaccidentlist = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getaccidentlistOK]);
export const setnewaccidentlist = createAction(`${ID}_setnewaccidentlist`);
export const levelAdding = createAction(`${ID}_levelAdding`);
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
	getaccidentlevellistOK,
	getaccidentlevellist,
	setnewaccidentlevellist,
	getaccidentlistOK,
	getaccidentlist,
	setnewaccidentlist,
	levelAdding,
	changedoc,
	patchdocument,
	Adding,
	leveledite,
	seteditefile,
	changeeditedoc,
	putdocument,
	edite,
	setedelfile,
	deletedocument
};

export default handleActions({
	[getaccidentlevellistOK]: (state, {payload}) => ({
		...state,
		accidentlevellistlist: payload
	}),
	[setnewaccidentlevellist]: (state, {payload}) => ({
		...state,
		newaccidentlevellistlist: payload
	}),
	[getaccidentlistOK]: (state, {payload}) => ({
		...state,
		accidentlist: payload
	}),
	[setnewaccidentlist]: (state, {payload}) => ({
		...state,
		newaccidentlist: payload
	}),
	[levelAdding]: (state, {payload}) => ({
		...state,
		levelAddVisible: payload
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
