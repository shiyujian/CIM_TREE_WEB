import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import { MAIN_API } from '_platform/api';

const ID = 'home_staff';

export const getOrgAttendInfoOK = createAction(`${ID}_获取部门出勤信息`);
const getOrgAttendInfo = createFetchAction(
    `${MAIN_API}/staff-statistic2/?org_code=&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`,
    [getOrgAttendInfoOK]
);
const getOrgAttendInfoT = createFetchAction(
    `${MAIN_API}/staff-statistic2/?org_code=&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`,
    []
);

const setMonthSection = createAction(`${ID}_设置统计时间区间`);
export const actions = {
    getOrgAttendInfoOK,
    getOrgAttendInfo,
    setMonthSection,
    getOrgAttendInfoT
};

export default handleActions(
    {
        [getOrgAttendInfoOK]: (state, { payload }) => ({
            ...state,
            orgAttendInfo: payload
        }),
        [setMonthSection]: (state, { payload }) => ({
            ...state,
            monthSection: payload
        })
    },
    {}
);
