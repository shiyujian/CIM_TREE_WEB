import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    MEETING_API,
    SYSTEM_API,
    LBSAMAP_API,
    LBSAMAP_KEY
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
// 地理位置获取
export const getLocationName = createFetchAction(`${LBSAMAP_API}/v3/geocode/regeo?key=${LBSAMAP_KEY}&s=rsv3&location={{location}}&radius=2800&callback=&platform=JS&logversion=2.0&sdkversion=1.3&appname=http%3A%2F%2Flbs.amap.com%2Fconsole%2Fshow%2Fpicker&csid=49851531-2AE3-4A3B-A8C8-675A69BCA316`, [], 'GET');
// 坐标系转换
export const getGcjbyGps = createFetchAction(`${LBSAMAP_API}/v3/assistant/coordinate/convert?key=${LBSAMAP_KEY}&locations={{locations}}&coordsys=gps`, [], 'GET');
export const actions = {
    getGcjbyGps,
    getLocationName,
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
