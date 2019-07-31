import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SYSTEM_API
} from '_platform/api';
export const ID = 'Checkwork_attendancecount';
// 示例action

// 修改查询条件
export const changeFilterData = createAction(`${ID}_changeFilterData`);
// 考勤列表
export const getCheckRecord = createFetchAction(`${SYSTEM_API}/check-record/list/`, [], 'GET');
// 获取考勤群体
export const getCheckGroup = createFetchAction(`${SYSTEM_API}/checkgroups`, [], 'GET');

export const actions = {
    changeFilterData,
    getCheckRecord,
    getCheckGroup
};
export default handleActions({
    [changeFilterData]: (state, {payload}) => ({
        ...state,
        filterData: payload
    })
}, {});
