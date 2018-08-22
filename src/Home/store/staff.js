import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import { base, SERVICE_API, USER_API } from '_platform/api';

const ID = 'home_staff';

export const getOrgAttendInfoOK = createAction(`${ID}_获取部门出勤信息`);
const getOrgAttendInfo = createFetchAction(
    `${base}/main/api/staff-statistic2/?org_code=&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`,
    [getOrgAttendInfoOK]
);
const getOrgAttendInfoT = createFetchAction(
    `${base}/main/api/staff-statistic2/?org_code=&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`,
    []
);
const getCurrentUserOrgCodeOK = createAction(`${ID}_获取当前用户org-code`);
const getCurrentUserOrgCode = createFetchAction(
    `${USER_API}/users/{{userId}}/`,
    [getCurrentUserOrgCodeOK]
);

const setMonthSection = createAction(`${ID}_设置统计时间区间`);
// 设置统计查询的数据
const setCountInfoAc = createAction(`${ID}_设置统计查询的数据`);
export const actions = {
    getOrgAttendInfoOK,
    getOrgAttendInfo,
    getCurrentUserOrgCodeOK,
    getCurrentUserOrgCode,
    setMonthSection,
    setCountInfoAc,
    getOrgAttendInfoT
};

export default handleActions(
    {
        [getOrgAttendInfoOK]: (state, { payload }) => ({
            ...state,
            orgAttendInfo: payload
        }),
        [setCountInfoAc]: (state, { payload }) => ({
            ...state,
            orgAttendInfo: payload
        }),
        [getCurrentUserOrgCodeOK]: (state, { payload }) => {
            // TOFIX:管理员账户无法获取当前用户组织名称,当管理员登录时写死
            return {
                ...state,
                thisOrgCode: payload.account
                    ? payload.account.org_code
                        ? payload.account.org_code
                        : window.DeathCode.OVERALL_APPROVAL_UNIT_CODE
                    : window.DeathCode.OVERALL_APPROVAL_UNIT_CODE
            };
        },
        [setMonthSection]: (state, { payload }) => ({
            ...state,
            monthSection: payload
        })
    },
    {}
);
