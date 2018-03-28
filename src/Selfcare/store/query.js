import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';

import {getUser} from '_platform/auth';
//查询当前单位下的所有人员信息
const getCheckListAcOK = createAction('QUERY查询当前单位下人员信息考勤记录');
// const getCheckListAc = createFetchAction(`http://bimcd.ecidi.com:6544/main/api/user/20/check-record/?month={{month}}`, [getCheckListAcOK]);
// const getCheckListAc = createFetchAction(`${base}/main/api/user/${getUser().id}/check-record/?month={{month}}`, [getCheckListAcOK]);
// 查询当前部门的上下班时间
// const getOrgInfoAc = createFetchAction(`http://bimcd.ecidi.com:6544/main/api/org/check-config/?org_code={{org_code}}&year={{year}}&month={{month}}`, []);
// const getOrgInfoAc = createFetchAction(`${SERVICE_API}/org-tree/code/{{org_code}}/`, []);
export const actions = {
	getCheckListAcOK,
	// getCheckListAc,
	// getOrgInfoAc,
};
export default handleActions({
	[getCheckListAcOK]: (state, {payload}) => ( {
		...state,
		checkList: payload
	}),
}, {});
