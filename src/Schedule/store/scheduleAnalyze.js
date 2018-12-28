import { createAction, handleActions } from 'redux-actions';
import { FOREST_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
const ID = 'SCHEDULEANALYZE';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const gettreetype = forestFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);
export const nowmessage = forestFetchAction(
    `${FOREST_API}/tree/queryTree?page=1&size=5`,
    []
);

export const getTotalSat = forestFetchAction(
    `${FOREST_API}/tree/totalstat`,
    []
);
export const gettreetypeAll = forestFetchAction(
    `${FOREST_API}/tree/treestat`,
    []
);
export const gettreetypeSection = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=Section`,
    []
);
export const gettreetypeSmallClass = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`,
    []
);
export const gettreetypeThinClass = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`,
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
