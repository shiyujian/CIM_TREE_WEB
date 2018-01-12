import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import moment from 'moment';
// import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';


//Tab切换状态
export const setTabActive1 = createAction('safety设置当前选中的tab');
//新闻列表的Tab切换状态
export const setNewsTabActive1 = createAction('safety列表的Tab切换状态');
//公告列表的Tab切换状态
export const setTipsTabActive1 = createAction('safety公告列表的Tab切换状态');
//发布或编辑新闻或公告的的modal
export const toggleModal2 = createAction('safety发布或编辑新闻或公告的的modal11222222222222');
//获取暂存的新闻列表
export const getDraftNewsListOK1 = createAction('safety获取暂存的新闻列表');
export const getDraftNewsList1 = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=%E6%96%B0%E9%97%BB&time=${moment().valueOf()}`, [getDraftNewsListOK1]);
//获取新闻列表
export const getNewsListOK1 = createAction('safety获取新闻列表');
export const getNewsList1 = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=%E6%96%B0%E9%97%BB&is_draft=false&time=${moment().valueOf()}`, [getNewsListOK1]);
//获取暂存的通知列表
export const getDraftTipsListOK1 = createAction('safety获取暂存的通知列表');
export const getDraftTipsList1 = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&is_draft=true&tag=%E5%85%AC%E5%91%8A&time=${moment().valueOf()}`, [getDraftTipsListOK1]);
//获取通知列表
export const getTipsListOK1 = createAction('safety获取通知列表');
export const getTipsList1 = createFetchAction(`${base}/main/api/post/?publisher={{user_id}}&tag=%E5%85%AC%E5%91%8A&is_draft=false&time=${moment().valueOf()}`, [getTipsListOK1]);
//发布新闻或公告
export const postData1 = createFetchAction(`${base}/main/api/post/`, [],'POST');
//编辑新闻或公告
export const patchData1 = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'PATCH');
//删除新闻或公告
export const deleteData1 = createFetchAction(`${base}/main/api/post/{{pk}}/`, [],'DELETE');

//设置上传的文件列表
export const postUploadFiles1 = createAction('safety设置上传的文件列表');

export const actions = {
	setTabActive1,
	setNewsTabActive1,
	setTipsTabActive1,
	toggleModal2,
	getDraftNewsListOK1,
	getDraftNewsList1,
	getNewsListOK1,
	getNewsList1,
	getDraftTipsListOK1,
	getDraftTipsList1,
	getTipsListOK1,
	getTipsList1,
	postData1,
	patchData1,
	deleteData1,
	postUploadFiles1,
};
export default handleActions({
	[setTabActive1]: (state, {payload}) => ( {
		...state,
		tabValue1: payload
	}),
	[setNewsTabActive1]: (state, {payload}) => ( {
		...state,
		newsTabValue1: payload
	}),
	[setTipsTabActive1]: (state, {payload}) => ( {
		...state,
		tipsTabValue1: payload
	}),
	[toggleModal2]: (state, {payload}) => {
		console.log("sadfsd");
		return {
			...state,
			toggleData1: payload
		}
	},
	[getDraftNewsListOK1]: (state, {payload}) => ( {
		...state,
		draftNewsLis1: payload
	}),
	[getNewsListOK1]: (state, {payload}) => ( {
		...state,
		newsList1: payload
	}),
	[getTipsListOK1]: (state, {payload}) => ( {
		...state,
		tipsList1: payload
	}),
	[getDraftTipsListOK1]: (state, {payload}) => ( {
		...state,
		draftTipsList1: payload
	}),
	[postUploadFiles1]: (state, {payload}) => ( {
		...state,
		fileList1: payload
	}),
}, {});
