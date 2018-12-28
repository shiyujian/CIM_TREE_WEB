import { createAction, handleActions } from 'redux-actions';
import { FOREST_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
const ID = 'ENTRY';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const gettreetype = forestFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);
export const gettreeevery = forestFetchAction(
    `${FOREST_API}/tree/treetypes`,
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
export const getSmallClassList = forestFetchAction(
    `${FOREST_API}/tree/wpunit4apps?parent={{no}}`,
    []
);

export const progressdata = forestFetchAction(
    `${FOREST_API}/tree/progressstat?`,
    []
);
export const progressalldata = forestFetchAction(
    `${FOREST_API}/tree/progresss?`,
    []
);
export const progressstat4pie = forestFetchAction(
    `${FOREST_API}/tree/progressstat4pie?`,
    []
);

export const actions = {
    setkeycode,
    gettreetype,
    getSmallClassList,
    getTotalSat,
    gettreeevery,
    nowmessage,
    gettreetypeAll,
    gettreetypeSection,
    gettreetypeSmallClass,
    gettreetypeThinClass,
    progressdata,
    progressalldata,
    progressstat4pie
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
