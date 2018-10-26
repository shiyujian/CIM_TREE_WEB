import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { FOREST_API, base } from '_platform/api';

export const ID = 'formmanage';
export const getworkTreeOK = createAction(`${ID}_文档目录树`);

export const actions = {
    getworkTreeOK
};

export default handleActions({
    [getworkTreeOK]: (state, { payload: { children } }) => ({
        ...state,
        worktree: children
    })
}, {});
