import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './dispatchFetchAction';
import createFetchActionT from 'fetch-action';
import { base, USER_API, SERVICE_API, EXCHANGE_API } from '_platform/api';
const ID = "DISPATCH"
//Tab切换状态
export const setTabActive = createAction(`${ID}设置当前选中的tab`);
//新闻列表的Tab切换状态
export const setNewsTabActive = createAction('新闻列表的Tab切换状态');

//发送文件的modal
export const toggleModalAc = createAction(`${ID}发送文件的modal`);
//上传的文件列表
export const postUploadFilesAc = createAction(`${ID}上传的文件列表`);
//获取组织机构列表
export const getOrgListAcOK = createAction(`${ID}获取组织机构列表`);
export const getOrgListAc = createFetchActionT(`${SERVICE_API}/org-tree/?depth=3`, [getOrgListAcOK]);
//获取接受单位的人员列表
export const getUsersListAcOK = createAction(`${ID}获取接受单位的人员列表`);
export const getUsersListAc = createFetchActionT(`${USER_API}/users/?org_code={{code}}`, [getUsersListAcOK]);
//获取抄送的人员列表
export const getCopyUsersAcOK = createAction(`${ID}获取抄送的人员列表`);
export const getCopyUsersAc = createFetchActionT(`${USER_API}/users/?org_code={{code}}`, [getCopyUsersAcOK]);
//获取收文列表
export const getReceiveInfoAcOK = createAction(`${ID}获取收文列表`);
export const getReceiveInfoAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/?user={{user}}&per_page=10000`, [getReceiveInfoAcOK]);
//获取发送的列表
export const getSentInfoAcOK = createAction(`${ID}获取发送的列表`);
export const getSentInfoAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/sent/?user={{user}}&per_page=10000`, [getSentInfoAcOK]);
//发送文件
export const postSentDocAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/creation/`, [], "POST");
//删除的发送文件
export const deleteSentDocAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/sent/{{id}}/?user={{user}}`, [], "DELETE");
//获取收文的详情信息
export const getReceiveDetailAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`, []);
//获取发文的详情信息
export const getSendDetailAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/sent/{{id}}/?user={{user}}`, []);
//收文已阅
export const patchReceiveDetailAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`, [], "PATCH");
//删除的收文
export const deleteReceiveDocAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`, [], "DELETE");
//发送短信接口
export const sentMessageAc = createFetchAction(`${EXCHANGE_API}/api/v1/sms/`, [], "POST");


//Loading加载状态
export const setLoadingAc = createAction('DISLoading加载状态');
//设置统计里面的时间
export const setCountTimeAc = createAction('DIS设置统计里面的时间');
export const setSearchTimeAc = createAction('DIS设置查询里面的时间');
//查询当前单位下的所有人员信息
//获取施工单位列表
const getOrgTreeOK = createAction('DIS获取施工单位列表');
const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/`, [getOrgTreeOK]);
//设置统计选中的单位
const setCountSelectedAc = createAction('DIS设置统计选中的单位');
//设置查询选中的单位
const setSearchSelectedAc = createAction('DIS设置查询选中的单位');

//部门考勤查询
const getSearchInfoAcOK = createAction('DIS部门考勤查询');
const getSearchInfoAc = createFetchAction(`${base}/main/api/staff-statistic/?org_code={{code}}&year={{year}}&month={{month}}`, [getSearchInfoAcOK]);

//查询当前单位下的所有人员信息
const getPersonsAcOK = createAction('DIS查询当前单位下的所有人员信息');
const getPersonsAc = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/?members=true`, [getPersonsAcOK]);
//设置统计查询的数据
const getCountInfoAcT = createFetchAction(`${base}/main/api/staff-statistic2/?org_code={{code}}&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`, []);
const setCountInfoAc = createAction('DIS设置统计查询的数据');

//查询部门出勤信息
const getCountInfoAcOK = createAction('DIS查询部门出勤信息');
const getCountInfoAc = createFetchAction(`${base}/main/api/staff-statistic2/?org_code={{code}}&fromyear={{fromyear}}&frommonth={{frommonth}}&toyear={{toyear}}&tomonth={{tomonth}}`, [getCountInfoAcOK]);


export const actions = {
	setTabActive,
	getReceiveInfoAcOK,
	getReceiveInfoAc,
	getSentInfoAcOK,
	getSentInfoAc,
	toggleModalAc,
	postUploadFilesAc,
	postSentDocAc,
	deleteSentDocAc,
	getReceiveDetailAc,
	getSendDetailAc,
	patchReceiveDetailAc,
	deleteReceiveDocAc,
	sentMessageAc,
	getOrgListAcOK,
	getOrgListAc,
	getUsersListAcOK,
	getUsersListAc,
	getCopyUsersAcOK,
	getCopyUsersAc,

	setLoadingAc,
	setCountTimeAc,

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


	setNewsTabActive
};
export default handleActions({
	[setTabActive]: (state, { payload }) => ({
		...state,
		tabValue: payload
	}),
	[getOrgListAcOK]: (state, { payload }) => ({
		...state,
		orgList: payload.children
	}),
	[getUsersListAcOK]: (state, { payload }) => ({
		...state,
		usersList: payload
	}),
	[getCopyUsersAcOK]: (state, { payload }) => ({
		...state,
		copyUsersList: payload
	}),
	[toggleModalAc]: (state, { payload }) => ({
		...state,
		visible: payload
	}),
	[getReceiveInfoAcOK]: (state, { payload }) => ({
		...state,
		receiveInfo: payload
	}),
	[getSentInfoAcOK]: (state, { payload }) => ({
		...state,
		sendInfo: payload
	}),
	[postUploadFilesAc]: (state, { payload }) => ({
		...state,
		fileList: payload
	}),


	[getOrgTreeOK]: (state, { payload }) => ({
		...state,
		orgList: payload.children
	}),
	[setCountSelectedAc]: (state, { payload }) => ({
		...state,
		countSelectedKey: payload
	}),
	[setSearchSelectedAc]: (state, { payload }) => ({
		...state,
		searchSelectedKey: payload
	}),
	[setCountInfoAc]: (state, { payload }) => ({
		...state,
		countInfo: payload
	}),
	[getCountInfoAcOK]: (state, { payload }) => ({
		...state,
		countInfo: payload
	}),
	[setLoadingAc]: (state, { payload }) => ({
		...state,
		loading: payload
	}),
	[setCountTimeAc]: (state, { payload }) => ({
		...state,
		countTime: payload
	}),
	[getSearchInfoAcOK]: (state, { payload }) => ({
		...state,
		searchInfo: payload
	}),
	[setSearchTimeAc]: (state, { payload }) => ({
		...state,
		searchTime: payload
	}),
	[getPersonsAcOK]: (state, { payload }) => ({
		...state,
		personList: payload.members || []
	}),

}, {});
