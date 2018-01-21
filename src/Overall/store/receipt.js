import {createAction, handleActions} from 'redux-actions';
import createFetchAction from './dispatchFetchAction';
import createFetchActionT from 'fetch-action';
import {USER_API, SERVICE_API,EXCHANGE_API,CODE_API} from '_platform/api';
const ID="RECEIPT"
//Tab切换状态
export const setTabActive = createAction(`${ID}设置当前选中的tab`);
//新闻列表的Tab切换状态
export const setNewsTabActive = createAction('RECEIPT新闻列表的Tab切换状态');
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
export const postSentDocAc = createFetchAction(`${CODE_API}/api/v1/file-notifications/creation/`, [],"POST");
//删除的发送文件
export const deleteSentDocAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/sent/{{id}}/?user={{user}}`, [],"DELETE");
//获取收文的详情信息
export const getReceiveDetailAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`, []);
//获取发文的详情信息
export const getSendDetailAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/sent/{{id}}/?user={{user}}`, []);
//收文已阅
export const patchReceiveDetailAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`, [],"PATCH");
//删除的收文
export const deleteReceiveDocAc = createFetchAction(`${EXCHANGE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`, [],"DELETE");
//发送短信接口
export const sentMessageAc = createFetchAction(`${EXCHANGE_API}/api/v1/sms/`, [],"POST");

//发布或编辑新闻或公告的的modal
export const toggleModal = createAction('RECEIPT发布或编辑新闻或公告的的modal');

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

	toggleModal,
	setNewsTabActive
};
export default handleActions({
	[setTabActive]: (state, {payload}) => ( {
		...state,
		tabValue: payload
	}),
	[getOrgListAcOK]: (state, {payload}) => ( {
		...state,
		orgList: payload.children
	}),
	[getUsersListAcOK]: (state, {payload}) => ( {
		...state,
		usersList: payload
	}),
	[getCopyUsersAcOK]: (state, {payload}) => ( {
		...state,
		copyUsersList: payload
	}),
	[toggleModalAc]: (state, {payload}) => ( {
		...state,
		visible: payload
	}),
	[getReceiveInfoAcOK]: (state, {payload}) => ( {
		...state,
		receiveInfo: payload
	}),
	[getSentInfoAcOK]: (state, {payload}) => ( {
		...state,
		sendInfo: payload
	}),
	[postUploadFilesAc]: (state, {payload}) => ( {
		...state,
		fileList: payload
	}),

	[toggleModal]: (state, {payload}) => ( {
		...state,
		toggleData: payload
	}),
	[setNewsTabActive]: (state, {payload}) => ( {
		...state,
		newsTabValue: payload
	}),
}, {});

