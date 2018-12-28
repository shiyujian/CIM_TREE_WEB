import { createAction, handleActions } from 'redux-actions';
import { FOREST_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
const ID = 'EnterAnalyze';

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
