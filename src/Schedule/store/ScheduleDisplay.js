import { createAction, handleActions } from 'redux-actions';
import {forestFetchAction} from '_platform/store/fetchAction';
import { FOREST_API } from '_platform/api';
const ID = 'SCHEDULEDISPLAY';

export const setkeycode = createAction(`${ID}_setkeycode`);
// 查询计划栽植量接口
export const getTreedayplans = forestFetchAction(
    `${FOREST_API}/tree/treedayplans`,
    []
);
// 查询实际栽植量接口
export const getTreetotalstatbyday = forestFetchAction(
    `${FOREST_API}/tree/treetotalstatbyday`,
    []
);
// 查询计划任务量
export const getTreesectionplans = forestFetchAction(
    `${FOREST_API}/tree/treesectionplans`,
    []
);
// 查询进度表
export const getProgressData = forestFetchAction(
    `${FOREST_API}/tree/progresss?`,
    []
);
export const actions = {
    setkeycode,
    getTreedayplans,
    getTreetotalstatbyday,
    getTreesectionplans,
    getProgressData
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
