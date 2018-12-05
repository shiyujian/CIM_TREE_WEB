import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import { FOREST_API } from '_platform/api';
const ID = 'entry';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const gettreetype = createFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);
export const gettreeevery = createFetchAction(
    `${FOREST_API}/tree/treetypes`,
    []
);
export const nowmessage = createFetchAction(
    `${FOREST_API}/tree/queryTree?page=1&size=5`,
    []
);

export const getTotalSat = createFetchAction(
    `${FOREST_API}/tree/totalstat`,
    []
);
export const gettreetypeAll = createFetchAction(
    `${FOREST_API}/tree/treestat`,
    []
);
export const gettreetypeSection = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=Section`,
    []
);
export const gettreetypeSmallClass = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`,
    []
);
export const gettreetypeThinClass = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`,
    []
);
export const getSmallClassList = createFetchAction(
    `${FOREST_API}/tree/wpunit4apps?parent={{no}}`,
    []
);

export const progressdata = createFetchAction(
    `${FOREST_API}/tree/progressstat?`,
    []
);
export const progressalldata = createFetchAction(
    `${FOREST_API}/tree/progresss?`,
    []
);
export const progressstat4pie = createFetchAction(
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
