import { createAction, handleActions } from 'redux-actions';
import { FOREST_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'auxiliaryAcceptance';
export const getworkTreeOK = createAction(`${ID}_文档目录树`);
export const getTreeTypeStatByRegion = forestFetchAction(`${FOREST_API}/tree/statbyregion4treetype`, [getworkTreeOK]);

export const actions = {
    getworkTreeOK,
    getTreeTypeStatByRegion
};

export default handleActions({
    [getworkTreeOK]: (state, { payload: { children } }) => ({
        ...state,
        worktree: children
    })
}, {});
