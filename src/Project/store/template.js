import {createAction,handleActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';

export const ID = 'TEMPLATE';
export const changeDocs = createAction(`${ID}_CHANGE_DOCS`);
export const savesb = createAction(`${ID}_savesb`);
export const putFolder = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, 'PUT');
export const setdir = createAction(`${ID}_setdir`);
export const getdirOK = createAction(`${ID}_getdirOK`);
export const getdir = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getdirOK]);
export const getkeywordOK = createAction(`${ID}_getkeyword`);
export const getkeyword = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getkeywordOK]);
export const setkeyword = createAction(`${ID}_setkeyword`);
export const setkeyvisible = createAction(`${ID}_setkeyvisible`);
export const savekeyword = createAction(`${ID}_savekeyword`);
export const saveselectvalue = createAction(`${ID}_saveselectvalue`);
export const setcurrentrecord = createAction(`${ID}_setcurrentrecord`);
export const setvalue = createAction(`${ID}_setvalue`);


export const actions = {
	changeDocs,
	savesb,
	putFolder,
	setdir,
	getdirOK,
	getdir,
	getkeywordOK,
	getkeyword,
	setkeyword,
	setkeyvisible,
	savekeyword,
	saveselectvalue,
	setcurrentrecord,
	setvalue
};

export default handleActions({
	[changeDocs]: (state, {payload}) => ({
		...state,
		docs: payload,
	}),
	[savesb]: (state, {payload}) => ({
		...state,
		sb: payload,
	}),
	[setdir]: (state, {payload}) => ({
		...state,
		dir: payload,
	}),
	[getdirOK]: (state, {payload}) => ({
		...state,
		olddir: payload.metalist,
	}),
	[getkeywordOK]: (state, {payload}) => ({
		...state,
		keyword: payload.metalist,
	}),
	[setkeyword]: (state, {payload}) => {
		return{
			...state,
			keyword: payload,
		};
	},
	[setkeyvisible]: (state, {payload}) => ({
		...state,
		keyvisible: payload,
	}),
	[savekeyword]: (state, {payload}) => ({
		...state,
		oldsavekeys:payload,
		savekeys: payload,
	}),
	[saveselectvalue]: (state, {payload}) => ({
		...state,
		savekeys: payload,
	}),
	[setcurrentrecord]: (state, {payload}) => ({
		...state,
		currentrecord: payload,
	}),
	[setvalue]: (state, {payload}) => ({
		...state,
		changevalue: payload,
	}),
}, {});
