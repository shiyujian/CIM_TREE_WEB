import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    MEETING_API,
    SYSTEM_API
} from '_platform/api';
export const ID = 'PROJECT_MEETING_MEETINGMANAGE';
// 示例action

// 修改查询条件
export const changeFilterData = createAction(`${ID}_changeFilterData`);
// 考勤列表
export const getCheckRecord = createFetchAction(`${SYSTEM_API}/checkrecords`, [], 'GET');
// 会议列表
export const getMeetingList = createFetchAction(`${MEETING_API}/meetings`, [], 'GET');
// 会议详情
export const getMeetingDetail = createFetchAction(`${MEETING_API}/meeting/{{ID}}`, [], 'GET');
// 会议创建
export const postMeeting = createFetchAction(`${MEETING_API}/meeting`, [], 'POST');
// 会议编辑
export const putMeeting = createFetchAction(`${MEETING_API}/meeting`, [], 'PUT');
// 会议删除
export const deleteMeeting = createFetchAction(`${MEETING_API}/meeting/{{ID}}`, [], 'DELETE');
export const actions = {
    getMeetingList,
    getMeetingDetail,
    postMeeting,
    putMeeting,
    deleteMeeting,
    changeFilterData,
    getCheckRecord
};
export default handleActions({
    [changeFilterData]: (state, {payload}) => ({
        ...state,
        filterData: payload
    })
}, {});
