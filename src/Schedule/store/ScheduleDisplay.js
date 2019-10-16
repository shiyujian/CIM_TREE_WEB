import { createAction, handleActions } from 'redux-actions';
import {forestFetchAction} from '_platform/store/fetchAction';
import { TREE_API } from '_platform/api';
const ID = 'SCHEDULEDISPLAY';

export const setkeycode = createAction(`${ID}_setkeycode`);
// 查询计划栽植量接口
export const getTreedayplans = forestFetchAction(
    `${TREE_API}/treedayplans`,
    []
);
// 查询实际栽植量接口
export const getTreetotalstatbyday = forestFetchAction(
    `${TREE_API}/treetotalstatbyday`,
    []
);
// 查询计划任务量
export const getTreesectionplans = forestFetchAction(
    `${TREE_API}/treesectionplans`,
    []
);
// 查询进度表
export const getProgressData = forestFetchAction(
    `${TREE_API}/progresss?`,
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
