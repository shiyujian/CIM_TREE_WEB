import {createAction,handleActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import createFetchAction2 from './myfetchAction';

export const ID = 'safetysystem';
export const getworkTreeOK = createAction(`${ID}_工程施工包`);
export const getworkTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=2`, [getworkTreeOK]);
export const getdirtreeOK = createAction(`${ID}_文档目录树`);
export const getdirtree = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/`, [getdirtreeOK]);
export const deletdir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`,[],'DELETE');
export const retn = createAction(`${ID}_文档不存在`);
export const setAddabel = createAction(`${ID}_Addable`);
export const setAddfile = createAction(`${ID}_setAddfile`);
export const changeadddocs = createAction(`${ID}_changeadddocs`);
export const postdir = createFetchAction(`${SERVICE_API}/directories/`, 'POST');
export const savecode = createAction(`${ID}_savecode`);
export const setkeycode = createAction(`${ID}_setkeycode`);
export const setdelrecord = createAction(`${ID}_setdelrecord`);
export const setAdddir = createAction(`${ID}_setAdddir`);
export const savepk = createAction(`${ID}_savepk`);
export const savenewshuzu = createAction(`${ID}_savenewshuzu`);
//  判断当前的父级
export const judgeParent = createAction(`${ID}_judgeParent`);
export const actions = {
	getworkTreeOK,
	getworkTree,
	getdirtreeOK,
	getdirtree,
    retn,
	setAddabel,
	setAddfile,
	changeadddocs,
	postdir,
	savecode,
	setkeycode,
	deletdir,
	setdelrecord,
	setAdddir,
	savepk,
	savenewshuzu,
	judgeParent
};

export default handleActions({
    [getworkTreeOK]: (state, {payload: {children}}) => ({
        ...state,
        worktree: children
    }),
	[getdirtreeOK]: (state, {payload: {children}}) => ({
		...state,
		dirtree: children
	}),
	[retn]: (state, {payload}) => ({
		...state,
		tableposible: payload
	}),
	[setAddabel]: (state, {payload}) => ({
		...state,
		Addable: payload
	}),
	[setAddfile]: (state, {payload}) => ({
		...state,
		addfile: payload
	}),
	[changeadddocs]: (state, {payload}) => ({
		...state,
		adddocs: payload
	}),
	[savecode]: (state, {payload}) => ({
		...state,
		savecode: payload
	}),
	[setkeycode]: (state, {payload}) => ({
		...state,
		keycode: payload
	}),
	[setdelrecord]: (state, {payload}) => ({
		...state,
		delrecord: payload
	}),
	[setAdddir]: (state, {payload}) => ({
		...state,
		adddirvisible: payload
	}),
	[savepk]: (state, {payload}) => ({
		...state,
		savepa: payload
	}),
	[savenewshuzu]: (state, {payload}) => ({
		...state,
		newshuzu: payload
	}),
	[judgeParent]: (state, {payload}) => ({
		...state,
		judgeParent: payload
	}),
}, {});
