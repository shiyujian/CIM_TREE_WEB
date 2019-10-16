import { createAction, handleActions } from 'redux-actions';
import { TREE_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
const ID = 'ENTERANALYZE';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const gettreetype = forestFetchAction(
    `${TREE_API}/nurserystat?`,
    []
);
export const gettreeevery = forestFetchAction(
    `${TREE_API}/treetypes`,
    []
);
export const nowmessage = forestFetchAction(
    `${TREE_API}/queryTree?page=1&size=5`,
    []
);

export const getTotalSat = forestFetchAction(
    `${TREE_API}/totalstat`,
    []
);

export const actions = {
    setkeycode,
    gettreetype,
    getTotalSat,
    gettreeevery,
    nowmessage
};
export default handleActions(
    {
        [setkeycode]: (state, { payload }) => {
            return {
                ...state,
                keycode: payload
            };
        }
    },
    {}
);
