import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API,
    base
} from '_platform/api';
export const ID = 'Checkwork_attendancecount';
// 示例action

// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);

// 考勤列表
export const getCheckRecord = createFetchAction(`${base}/main/api/check-record/list/?{{params}}`, [], 'GET')

export const actions = {
    getCheckRecord
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    })
}, {});
