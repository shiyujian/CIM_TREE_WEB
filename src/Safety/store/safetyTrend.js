import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import moment from 'moment';
// import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';

//Tab切换状态
export const setTabActive = createAction('xhy设置当前选中的tab');
//安全事故快报列表的Tab切换状态
export const setBulletinTabActive = createAction('xh安全事故快报列表的Tab切换状态');
//项目安全公告列列表的Tab切换状态
export const setNoticeTabActive = createAction('xhy项目安全公告列表的Tab切换状态');
//国内安全动态列表的Tab切换状态
export const setStateTabActive = createAction('xhy国内安全动态列表的Tab切换状态');
//安全生产视频列表的Tab切换状态
export const setVideoTabActive = createAction('xhy安全生产视频列表的Tab切换状态');
//发布或编辑新闻或公告的的modal
export const toggleModal = createAction('xhy发布或编辑新闻或公告的的modal');
//获取暂存的新闻列表
export const getDraftNewsListOK = createAction('xhy获取暂存的新闻列表');
export const getDraftNewsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=新闻&time=${moment().valueOf()}`, [getDraftNewsListOK]);
//获取新闻列表
export const getNewsListOK = createAction('xhy获取新闻列表');
export const getNewsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=新闻&is_draft=false&time=${moment().valueOf()}`, [getNewsListOK]);
//获取暂存的通知列表
export const getDraftTipsListOK = createAction('xhy获取暂存的通知列表');
export const getDraftTipsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=公告&time=${moment().valueOf()}`, [getDraftTipsListOK]);
//获取通知列表
export const getTipsListOK = createAction('xhy获取通知列表');
export const getTipsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=公告&is_draft=false&time=${moment().valueOf()}`, [getTipsListOK]);
//发布新闻或公告
export const postData = createFetchAction(`${base}/main/api/post/`, [],'POST');
//编辑新闻或公告
export const patchData = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'PATCH');
//删除新闻或公告
export const deleteData = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'DELETE');

//设置上传的文件列表
export const postUploadFiles = createAction('xhy设置上传的文件列表');

export const actions = {
	setTabActive,
	setBulletinTabActive,
	setNoticeTabActive,
	setStateTabActive,
	setVideoTabActive,
	toggleModal,
	getDraftNewsListOK,
	getDraftNewsList,
	getNewsListOK,
	getNewsList,
	getDraftTipsListOK,
	getDraftTipsList,
	getTipsListOK,
	getTipsList,
	postData,
	patchData,
	deleteData,
	postUploadFiles,
};
export default handleActions({
	[setTabActive]: (state, {payload}) => ( {
		...state,
		tabValue: payload
	}),
	[setBulletinTabActive]: (state, {payload}) => ( {
		...state,
		bulletinTabValue: payload
	}),
	[setNoticeTabActive]: (state, {payload}) => ( {
		...state,
		noticeTabValue: payload
	}),
	[setStateTabActive]: (state, {payload}) => ( {
		...state,
		stateTabValue: payload
	}),
	[setVideoTabActive]: (state, {payload}) => ( {
		...state,
		videoTabValue: payload
	}),
	[toggleModal]: (state, {payload}) => ( {
		...state,
		toggleData: payload
	}),
	[getDraftNewsListOK]: (state, {payload}) => ( {
		...state,
		draftNewsLis: payload
	}),
	[getNewsListOK]: (state, {payload}) => ( {
		...state,
		newsList: payload
	}),
	[getTipsListOK]: (state, {payload}) => ( {
		...state,
		tipsList: payload
	}),
	[getDraftTipsListOK]: (state, {payload}) => ( {
		...state,
		draftTipsList: payload
	}),
	[postUploadFiles]: (state, {payload}) => ( {
		...state,
		fileList: payload
	}),
}, {});
