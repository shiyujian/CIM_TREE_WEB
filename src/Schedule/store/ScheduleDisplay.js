import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';
//
import { FOREST_API } from '_platform/api';
const ID = 'ScheduleDisplay';

export const setkeycode = createAction(`${ID}_setkeycode`);
// 查询计划栽植量接口
export const getTreedayplans = createFetchAction(
    `${FOREST_API}/tree/treedayplans`,
    []
);
// 查询实际栽植量接口
export const getTreetotalstatbyday = createFetchAction(
    `${FOREST_API}/tree/treetotalstatbyday`,
    []
);
// 查询计划任务量
export const getTreesectionplans = createFetchAction(
    `${FOREST_API}/tree/treesectionplans`,
    []
);
// 查询进度表
export const getProgressData = createFetchAction(
    `${FOREST_API}/tree/progresss?`,
    []
);
export const getTestData = forestFetchAction(`${FOREST_API}:6510/tree/tree/abn2017`, []);
export const actions = {
    setkeycode,
    getTreedayplans,
    getTreetotalstatbyday,
    getTreesectionplans,
    getProgressData,
    getTestData
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
