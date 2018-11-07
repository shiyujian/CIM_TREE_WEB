import { createAction, handleActions, combineActions } from 'redux-actions';

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
