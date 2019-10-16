import { createAction, handleActions } from 'redux-actions';
import { TREE_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
const ID = 'SCHEDULEANALYZE';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const gettreetype = forestFetchAction(
    `${TREE_API}/nurserystat?`,
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
export const gettreetypeAll = forestFetchAction(
    `${TREE_API}/treestat`,
    []
);
export const gettreetypeSection = forestFetchAction(
    `${TREE_API}/treestatbyspecfield?stattype=Section`,
    []
);
export const gettreetypeSmallClass = forestFetchAction(
    `${TREE_API}/treestatbyspecfield?stattype=SmallClass`,
    []
);
export const gettreetypeThinClass = forestFetchAction(
    `${TREE_API}/treestatbyspecfield?stattype=ThinClass`,
    []
);

export const actions = {
    setkeycode,
    gettreetype,
    getTotalSat,
    nowmessage,
    gettreetypeAll,
    gettreetypeSection,
    gettreetypeSmallClass,
    gettreetypeThinClass
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
