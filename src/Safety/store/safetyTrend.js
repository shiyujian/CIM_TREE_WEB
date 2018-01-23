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


//发布新闻或公告
export const postData = createFetchAction(`${base}/main/api/post/`, [],'POST');
//编辑新闻或公告
export const patchData = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'PATCH');
//删除新闻或公告
export const deleteData = createFetchAction(`${base}/main/api/post/{{pk}}/?this=true`, [],'DELETE');

//设置上传的文件列表
export const postUploadFiles = createAction('xhy设置上传的文件列表');

//设置上传的视频
export const postUploadVideo = createAction('xhy设置上传的视频');

//获取暂存的项目安全公告
export const getDraftTipsListOK = createAction('xhy获取暂存项目安全公告');
export const getDraftTipsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=公告&category=1&time=${moment().valueOf()}`, [getDraftTipsListOK]);
//获取项目安全公告
export const getTipsListOK = createAction('xhy获取项目安全公告');
export const getTipsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=公告&is_draft=false&category=1&time=${moment().valueOf()}`, [getTipsListOK]);

//获取暂存的国内安全动态
export const getDraftNewsListOK = createAction('xhy获取暂存的国内安全动态');
export const getDraftNewsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=新闻&category=2&time=${moment().valueOf()}`, [getDraftNewsListOK]);
//获取国内安全动态
export const getNewsListOK = createAction('xhy获取国内安全动态');
export const getNewsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=新闻&is_draft=false&category=2&time=${moment().valueOf()}`, [getNewsListOK]);

//获取暂存的安全事故快报
export const getTrendsListOK = createAction('xhy获取暂存安全事故快报');
export const getTrendsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=公告&category=3&time=${moment().valueOf()}`, [getTrendsListOK]);
//获取安全事故快报
export const getTrenListOK = createAction('xhy获取安全事故快报');
export const getTrenList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=公告&is_draft=false&category=3&time=${moment().valueOf()}`, [getTrenListOK]);

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
	postUploadVideo,

	getTrendsListOK,
	getTrendsList,
	getTrenListOK,
	getTrenList



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
	[postUploadVideo]: (state, {payload}) => ( {
		...state,
		videoList: payload
	}),



	[getTrenListOK]: (state, {payload}) => ( {
		...state,
		trenList: payload
	}),
	[getTrendsListOK]: (state, {payload}) => ( {
		...state,
		trendsList: payload
	}),

}, {});
