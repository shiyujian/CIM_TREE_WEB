import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';
//Tab切换状态
export const setTabActive = createAction('ATTEND设置当前选中的tab');
//Loading加载状态
export const setLoadingAc = createAction('ATTENDLoading加载状态');
//设置统计里面的时间
export const setCountTimeAc = createAction('ATTEND设置统计里面的时间');
//获取施工单位列表
const getOrgTreeOK = createAction('ATTEND获取施工单位列表');
const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/`, [getOrgTreeOK]);
//设置统计选中的单位
const setCountSelectedAc = createAction('ATTEND设置统计选中的单位');
//设置查询选中的单位
const setSearchSelectedAc = createAction('ATTEND设置查询选中的单位');
//查询部门出勤信息
const getCountInfoAcOK = createAction('ATTEND查询部门出勤信息');
const getCountInfoAc = createFetchAction(`${base}/main/api/staff-statistic2/?org_code={{code}}&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`, [getCountInfoAcOK]);
//部门考勤查询
const getSearchInfoAcOK = createAction('ATTEND部门考勤查询');
const getSearchInfoAc = createFetchAction(`${base}/main/api/staff-statistic/?org_code={{code}}&year={{year}}&month={{month}}`, [getSearchInfoAcOK]);
//设置查询里面的时间
export const setSearchTimeAc = createAction('ATTEND设置查询里面的时间');
//查询当前单位下的所有人员信息
const getPersonsAcOK = createAction('ATTEND查询当前单位下的所有人员信息');
const getPersonsAc = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/?members=true`, [getPersonsAcOK]);
//设置统计查询的数据
const getCountInfoAcT = createFetchAction(`${base}/main/api/staff-statistic2/?org_code={{code}}&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`, []);
const setCountInfoAc = createAction('ATTEND设置统计查询的数据');
// 控制新增进场弹框
const setModal = createAction('setModal控制新增弹窗');

export const actions = {
	setTabActive,
	getOrgTreeOK,
	getOrgTree,
	setCountSelectedAc,
	setSearchSelectedAc,
	getCountInfoAcOK,
	getCountInfoAc,
	setLoadingAc,
	setCountTimeAc,
	getSearchInfoAcOK,
	getSearchInfoAc,
	setSearchTimeAc,
	getPersonsAcOK,
	getPersonsAc,
	getCountInfoAcT,
	setCountInfoAc,
	setModal
};
export default handleActions({
	[setModal]: (state, {payload}) => ( {
		...state,
		setModalvisible: payload
	}),
	[setTabActive]: (state, {payload}) => ( {
		...state,
		tabValue: payload
	}),
	[getOrgTreeOK]: (state, {payload}) => ( {
		...state,
		orgList: payload.children
	}),
	[setCountSelectedAc]: (state, {payload}) => ( {
		...state,
		countSelectedKey: payload
	}),
	[setSearchSelectedAc]: (state, {payload}) => ( {
		...state,
		searchSelectedKey: payload
	}),
	[setCountInfoAc]: (state, {payload}) => ( {
		...state,
		countInfo: payload
	}),
	[getCountInfoAcOK]: (state, {payload}) => ( {
		...state,
		countInfo: payload
	}),
	[setLoadingAc]: (state, {payload}) => ( {
		...state,
		loading: payload
	}),
	[setCountTimeAc]: (state, {payload}) => ( {
		...state,
		countTime: payload
	}),
	[getSearchInfoAcOK]: (state, {payload}) => ( {
		...state,
		searchInfo: payload
	}),
	[setSearchTimeAc]: (state, {payload}) => ( {
		...state,
		searchTime: payload
	}),
	[getPersonsAcOK]: (state, {payload}) => ( {
		...state,
		personList: payload.members || []
	}),
}, {});
