import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import moment from 'moment';
// import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';

//Tab切换状态
export const setTabActive = createAction('设置当前选中的tab');
//新闻列表的Tab切换状态
export const setNewsTabActive = createAction('新闻列表的Tab切换状态');
//公告列表的Tab切换状态
export const setTipsTabActive = createAction('公告列表的Tab切换状态');
//发布或编辑新闻或公告的的modal
export const toggleModal = createAction('发布或编辑新闻或公告的的modal');
//获取暂存的新闻列表
export const getDraftNewsListOK = createAction('获取暂存的新闻列表');
export const getDraftNewsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=%E6%96%B0%E9%97%BB&category=4&time=${moment().valueOf()}`, [getDraftNewsListOK]);
//获取新闻列表
export const getNewsListOK = createAction('获取新闻列表');
export const getNewsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=%E6%96%B0%E9%97%BB&is_draft=false&category=4&time=${moment().valueOf()}`, [getNewsListOK]);
//获取暂存的通知列表
export const getDraftTipsListOK = createAction('获取暂存的通知列表');
export const getDraftTipsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=%E5%85%AC%E5%91%8A&category=4&time=${moment().valueOf()}`, [getDraftTipsListOK]);
//获取通知列表
export const getTipsListOK = createAction('获取通知列表');
export const getTipsList = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=%E5%85%AC%E5%91%8A&is_draft=false&category=4&time=${moment().valueOf()}`, [getTipsListOK]);
//发布新闻或公告
export const postData = createFetchAction(`${base}/main/api/post/`, [],'POST');
//编辑新闻或公告
export const patchData = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'PATCH');
//删除新闻或公告
export const deleteData = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'DELETE');

//设置上传的文件列表
export const postUploadFiles = createAction('设置上传的文件列表');

export const actions = {
	setTabActive,
	setNewsTabActive,
	setTipsTabActive,
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
	[setNewsTabActive]: (state, {payload}) => ( {
		...state,
		newsTabValue: payload
	}),
	[setTipsTabActive]: (state, {payload}) => ( {
		...state,
		tipsTabValue: payload
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
