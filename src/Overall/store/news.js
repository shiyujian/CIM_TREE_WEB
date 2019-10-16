import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import { base, NEWS_API } from '_platform/api';
const ID = 'informatization_news';
// Tab切换状态
export const setTabActive = createAction(`${ID}设置当前选中的tab`);
// 发布或编辑新闻或公告的的modal
export const toggleModal = createAction(`${ID}发布或编辑新闻或公告的的modal`);

// 设置上传的文件列表
export const postUploadFiles = createAction(`${ID}设置上传的文件列表`);

// 新接口 2019-7-17
// 新闻类型
export const getNewsTypes = fetchAction(`${NEWS_API}/newstypes`);
// 新闻列表
export const getNewsListNewOK = createAction(`${ID}获取新闻列表`);
export const getNewsListNew = fetchAction(`${NEWS_API}/newss`, [getNewsListNewOK]);
// 新闻详情
export const getNewsDetails = fetchAction(`${NEWS_API}/news/{{ID}}`);
// 新闻发布
export const postNews = fetchAction(`${NEWS_API}/news`, [], 'POST');
// 新闻编辑
export const putNews = fetchAction(`${NEWS_API}/news`, [], 'PUT');
// 新闻删除
export const deleteNews = fetchAction(`${NEWS_API}/news/{{ID}}`, [], 'DELETE');

// 公告类型
export const getNoticetypes = fetchAction(`${NEWS_API}/noticetypes`);
// 公告列表
export const getNoticeListOK = createAction(`${ID}获取公告列表`);
export const getNoticeList = fetchAction(`${NEWS_API}/notices`, [getNoticeListOK]);
// 公告详情
export const getNoticeDetails = fetchAction(`${NEWS_API}/notice/{{ID}}`);
// 公告发布
export const postNotice = fetchAction(`${NEWS_API}/notice`, [], 'POST');
// 公告编辑
export const putNotice = fetchAction(`${NEWS_API}/notice`, [], 'PUT');
// 公告删除
export const deleteNotice = fetchAction(`${NEWS_API}/notice/{{ID}}`, [], 'DELETE');
// 上传附件
export const uploadFileHandler = myFetch(`${base}/OSSUploadHandler.ashx?filetype=news`, [], 'POST');

export const actions = {
    getNewsTypes,
    getNewsListNewOK,
    getNewsListNew,
    getNewsDetails,
    postNews,
    putNews,
    deleteNews,
    getNoticetypes,
    getNoticeListOK,
    getNoticeList,
    getNoticeDetails,
    postNotice,
    putNotice,
    deleteNotice,
    uploadFileHandler,

    setTabActive,
    toggleModal,
    postUploadFiles
};
export default handleActions({
    [setTabActive]: (state, { payload }) => ({
        ...state,
        tabValue: payload
    }),
    [toggleModal]: (state, { payload }) => ({
        ...state,
        toggleData: payload
    }),
    [getNewsListNewOK]: (state, { payload }) => ({
        ...state,
        newsList: payload.content
    }),
    [getNoticeListOK]: (state, { payload }) => ({
        ...state,
        tipsList: payload.content
    }),
    [postUploadFiles]: (state, { payload }) => ({
        ...state,
        fileList: payload
    })
}, {});
