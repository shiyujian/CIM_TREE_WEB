import {createAction,handleActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';

export const ID = 'SETUP_KEYWORD';
export const getworkTreeOK = createAction(`${ID}_工程施工包`);
export const getworkTree = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/`, [getworkTreeOK]);
export const getparentdirOK = createAction(`${ID}_获取父亲级信息`);
export const getparentdir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?parent=true`, [getparentdirOK]);
export const settablevisible = createAction(`${ID}_tableposible`);
export const setinputvisble = createAction(`${ID}_inputvisible`);
export const setcodevisible = createAction(`${ID}_setcodevisible`);
export const setselectcode = createAction(`${ID}_selectcode`);
export const setAddvisible = createAction(`${ID}_setAddvisible`);
export const changeadddocs = createAction(`${ID}_changeadddocs`);
export const putdir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/`, 'PUT');
export const setswichvisible =createAction(`${ID}_setswichvisible`);
export const setkeycode =createAction(`${ID}_setkeycode`);
export const savenewshuzu = createAction(`${ID}_savenewshuzu`);
export const getkeywordOK = createAction(`${ID}_getkeyword`);
export const getkeyword = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getkeywordOK]);
export const setvalue =createAction(`${ID}_setvalue`);

export const actions = {
	getworkTreeOK,
	getworkTree,
	putdir,
	settablevisible,
	setselectcode,
	setinputvisble,
	getparentdirOK,
	getparentdir,
	setAddvisible,
	changeadddocs,
	setcodevisible,
	setswichvisible,
	setkeycode,
	savenewshuzu,
	getkeywordOK,
	getkeyword,
	setvalue
};

export default handleActions({
	[setvalue]: (state, {payload}) =>({
		...state,
		setvalue: payload
	}),
	[getworkTreeOK]: (state, {payload: {children}}) => ({
		...state,
		worktree: children
	}),
	[settablevisible]: (state, {payload}) =>({
		...state,
		tableposible: payload
	}),
	[setinputvisble]: (state, {payload}) => ({
		...state,
		inputvisible: payload
	}),
	[setcodevisible]: (state, {payload}) => ({
		...state,
		codevisible: payload
	}),
	[setselectcode]: (state, {payload}) => ({
		...state,
		selectcode: payload
	}),
	[getparentdirOK]: (state, {payload}) => ({
		...state,
		parentdir: payload.parent,
		extradir:payload.extra_params,
		comdir:payload
	}),
	[setAddvisible]: (state, {payload}) => ({
		...state,
		Addable:payload
	}),
	[setswichvisible]: (state, {payload}) => ({
		...state,
		swichvisible:payload
	}),
	[changeadddocs]: (state, {payload}) => {
		return {
			...state,
			adddocs:payload
		}
	},
	[setkeycode]: (state, {payload}) => ({
		...state,
		keycode: payload
	}),
	[savenewshuzu]: (state, {payload}) => ({
		...state,
		newshuzu: payload
	}),
	[getkeywordOK]: (state, {payload}) => ({
		...state,
		keyword: payload.metalist,
	}),
}, {});
