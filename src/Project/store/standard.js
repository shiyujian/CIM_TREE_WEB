import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, base } from '_platform/api';

export const ID = 'standard';
export const getworkTreeOK = createAction(`${ID}_文档目录树`);
export const getworkTree = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`, [getworkTreeOK]);
export const setcurrentcode = createAction(`${ID}_Current_Code`);

const addDir = createFetchAction(`${SERVICE_API}/directories/`, 'POST');

const refreshPanelTo = createAction('refreshPanel');

const removeDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`, [], 'DELETE');

const savecode = createAction(`${ID}_savecode`);

const changeadddocs = createAction(`${ID}_changeadddocs`);

const onSelectnode = createAction(`${ID}_changeadddocs`);

export const setcurrentpk = createAction(`${ID}_setcurrentpk`);

export const savepk = createAction(`${ID}_savepk`);

export const actions = {
    getworkTreeOK,
    getworkTree,
    setcurrentcode,
    onSelectnode,
    addDir,
    refreshPanelTo,
    removeDir,
    savecode,
    changeadddocs,
    setcurrentpk,
    savepk
};

export default handleActions({
    [getworkTreeOK]: (state, {payload: {children}}) => ({
	    ...state,
	    worktree: children
    }),
    [onSelectnode]: (state, { payload }) => ({
        ...state,
        onSelectnode: payload
    }),
    [setcurrentcode]: (state, { payload }) => ({
        ...state,
        currentcode: payload
    }),
    [refreshPanelTo]: (state, { payload }) => ({
        ...state,
        adddelpanel: payload
    }),
    [savecode]: (state, { payload }) => ({
        ...state,
        keycode: payload
    }),
    [changeadddocs]: (state, {payload}) => ({
        ...state,
        adddocs: payload
    }),
    [setcurrentpk]: (state, {payload}) => ({
        ...state,
        currentpk: payload
    }),
    [savepk]: (state, {payload}) => ({
        ...state,
        datumpk: payload
    })
}, {});
