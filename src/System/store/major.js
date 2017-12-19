import {createAction,handleActions,combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'major';
export const getmajorlistOK = createAction(`${ID}_wxlist`);
export const getmajorlist =createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getmajorlistOK]);
export const setnewprofessionlist = createAction(`${ID}_setnewprofessionlist`);
export const levelAdding = createAction(`${ID}_levelAdd`);
// export const setnewcode = createAction(`${ID}_setnewcode`);
export const changedoc = createAction(`${ID}_setdoc`);
export const leveledite = createAction(`${ID}_leveledite`);
export const seteditefile =createAction(`${ID}_seteditefile`);
export const patchdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PATCH');
export const changeeditedoc = createAction(`${ID}_changeeditedoc`);
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const setedelfile = createAction(`${ID}_setedelfile`);
export const deletedocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/?index={{dex}}`, 'DELETE');

export const actions = {
	getmajorlistOK,
	getmajorlist,
	setnewprofessionlist,
	levelAdding,
	// setnewcode,
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
	[getmajorlistOK]: (state, {payload}) => ({
		...state,
		major: payload
	}),
	[setnewprofessionlist]: (state, {payload}) => ({
		...state,
		newprofessionlist: payload
	}),
	[levelAdding]: (state, {payload}) => ({
		...state,
		levelAddVisible: payload
	}),
	// [setnewcode]: (state, {payload}) => ({
	// 	...state,
	// 	newcoded: payload
	// }),
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
