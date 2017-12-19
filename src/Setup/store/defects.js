import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'defects';
export const getdefectslistOK = createAction(`${ID}_getdefectslist`);
export const getdefectslist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getdefectslistOK]);
export const setnewdefectslist = createAction(`${ID}_setnewdefectslist`);
export const levelAdding = createAction(`${ID}_levelAdd`);
export const changedoc = createAction(`${ID}_setdoc`);
export const leveledite = createAction(`${ID}_leveledite`);
export const seteditefile =createAction(`${ID}_seteditefile`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const changeeditedoc = createAction(`${ID}_changeeditedoc`);
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const setedelfile = createAction(`${ID}_setedelfile`);
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');

export const actions = {
	getdefectslistOK,
	getdefectslist,
	setnewdefectslist,
	levelAdding,
	changedoc,
	patchdocument,
	leveledite,
	seteditefile,
	changeeditedoc,
	putdocument,
	setedelfile,
	deletedocument
};

export default handleActions({
	[getdefectslistOK]: (state, {payload}) => ({
		...state,
		defectslist: payload
	}),
	[setnewdefectslist]: (state, {payload}) => ({
		...state,
		newdefectslist: payload
	}),
	[levelAdding]: (state, {payload}) => ({
		...state,
		levelAddVisible: payload
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
}, {});
