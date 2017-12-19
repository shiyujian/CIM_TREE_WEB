import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'hazard';
export const getstageOK = createAction(`${ID}_wxlist`);
export const getstage =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getstageOK]);
export const setnewstagelist = createAction(`${ID}_setnewstagelist`);
export const levelAdding = createAction(`${ID}_levelAdd`);
export const changedoc = createAction(`${ID}_setdoc`);
export const leveledite = createAction(`${ID}_leveledite`);
export const seteditefile =createAction(`${ID}_seteditefile`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const changeeditedoc = createAction(`${ID}_changeeditedoc`);
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const setedelfile = createAction(`${ID}_setedelfile`);
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');

export const getProjectOK = createAction(`${ID}_getProjectOK`);
export const getProject =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getProjectOK]);
export const setnewProject = createAction(`${ID}_setnewProject`);
export const Adding = createAction(`${ID}_Adding`);
export const edite  = createAction(`${ID}_edite`);
export const actions = {
	getstageOK,
	getstage,
	setnewstagelist,
	levelAdding,
	changedoc,
	patchdocument,
	leveledite,
	seteditefile,
	changeeditedoc,
	putdocument,
	setedelfile,
	deletedocument,
	getProjectOK,
	getProject,
	setnewProject,
	Adding,
	edite
};

export default handleActions({
	[getstageOK]: (state, {payload}) => ({
		...state,
		stagelist: payload
	}),
	[setnewstagelist]: (state, {payload}) => ({
		...state,
		newstagelist: payload
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
		designvisible: payload
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
	[getProjectOK]:(state, {payload}) => ({
		...state,
		Projectlist: payload
	}),
	[setnewProject]:(state, {payload}) => ({
		...state,
		NewProjectlist: payload
	}),
	[Adding]: (state, {payload}) => ({
		...state,
		AddVisible: payload
	}),
	[edite]: (state, {payload}) => ({
		...state,
		editevisible: payload
	}),
}, {});
