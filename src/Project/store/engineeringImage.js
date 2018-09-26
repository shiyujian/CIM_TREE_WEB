import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API } from '_platform/api';

export const ID = 'engineeringImage';
export const getworkTreeOK = createAction(`${ID}_文档目录树`);
export const getworkTree = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`, [getworkTreeOK]);

const addDir = createFetchAction(`${SERVICE_API}/directories/`, 'POST');

const removeDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`, [], 'DELETE');

export const savepk = createAction(`${ID}_savepk`);

export const actions = {
    getworkTreeOK,
    getworkTree,
    addDir,
    removeDir,
    savepk
};

export default handleActions({
    [getworkTreeOK]: (state, {payload: {children}}) => ({
	    ...state,
	    worktree: children
    }),
    [savepk]: (state, {payload}) => ({
        ...state,
        datumpk: payload
    })
}, {});
