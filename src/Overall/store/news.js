import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import { base, MAIN_API, SERVICE_API } from '_platform/api';
const ID = 'informatization_news';
// Tab切换状态
export const setTabActive = createAction(`${ID}设置当前选中的tab`);
// 发布或编辑新闻或公告的的modal
export const toggleModal = createAction(`${ID}发布或编辑新闻或公告的的modal`);
// 获取暂存的新闻列表
export const getDraftNewsListOK = createAction(`${ID}获取暂存的新闻列表`);
export const getDraftNewsList = createFetchAction(`${MAIN_API}/post/`, [getDraftNewsListOK]);
// 获取新闻列表
export const getNewsListOK = createAction(`${ID}获取新闻列表`);
export const getNewsList = createFetchAction(`${MAIN_API}/post/`, [getNewsListOK]);
// 获取暂存的通知列表
export const getDraftTipsListOK = createAction(`${ID}获取暂存的通知列表`);
export const getDraftTipsList = createFetchAction(`${MAIN_API}/post/`, [getDraftTipsListOK]);
// 获取通知列表
export const getTipsListOK = createAction(`${ID}获取通知列表`);
export const getTipsList = createFetchAction(`${MAIN_API}/post/`, [getTipsListOK]);
// 发布新闻或公告
export const postData = createFetchAction(`${MAIN_API}/post/`, [], 'POST');
// 编辑新闻或公告
export const patchData = createFetchAction(`${MAIN_API}/post/{{pk}}/`, [], 'PATCH');
// 删除新闻或公告
export const deleteData = createFetchAction(`${MAIN_API}/post/{{pk}}/`, [], 'DELETE');

// 设置上传的文件列表
export const postUploadFiles = createAction(`${ID}设置上传的文件列表`);

// 新接口 2019-7-17
// 新闻类型
export const getNewsTypes = fetchAction(`${MAIN_API}/newstypes`);
// 新闻列表
export const getNewsListNewOK = createAction(`${ID}获取新闻列表`);
export const getNewsListNew = fetchAction(`${MAIN_API}/newss`, [getNewsListNewOK]);
// 新闻详情
export const getNewsDetails = fetchAction(`${MAIN_API}/news/{{ID}}`);
// 新闻发布
export const postNews = fetchAction(`${MAIN_API}/news`, [], 'POST');
// 新闻编辑
export const putNews = fetchAction(`${MAIN_API}/news`, [], 'PUT');
// 新闻删除
export const deleteNews = fetchAction(`${MAIN_API}/news/{{ID}`, [], 'DELETE');

// 公告类型
export const getNoticetypes = fetchAction(`${MAIN_API}/noticetypes`);
// 公告列表
export const getNoticeListOK = createAction(`${ID}获取公告列表`);
export const getNoticeList = fetchAction(`${MAIN_API}/notices`, [getNoticeListOK]);
// 公告详情
export const getNoticeDetails = fetchAction(`${MAIN_API}/notice/{{ID}}`);
// 公告发布
export const postNotice = fetchAction(`${MAIN_API}/notice`, [], 'POST');
// 公告编辑
export const putNotice = fetchAction(`${MAIN_API}/notice`, [], 'PUT');
// 新闻删除
export const deleteNotice = fetchAction(`${MAIN_API}/news/{{ID}`, [], 'DELETE');
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
    [getDraftNewsListOK]: (state, { payload }) => ({
        ...state,
        draftNewsLis: payload
    }),
    [getNewsListNewOK]: (state, { payload }) => ({
        ...state,
        newsList: payload.content
    }),
    [getNoticeListOK]: (state, { payload }) => ({
        ...state,
        tipsList: payload.content
    }),
    [getDraftTipsListOK]: (state, { payload }) => ({
        ...state,
        draftTipsList: payload
    }),
    [postUploadFiles]: (state, { payload }) => ({
        ...state,
        fileList: payload
    })
}, {});
