import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import { MAIN_API, SERVICE_API } from '_platform/api';
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
// 获取发布单位列表
const getPublicUnitList = createFetchAction(`${SERVICE_API}/org-tree/?depth=4`, [], 'GET');

export const actions = {
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
    postUploadFiles,
    getPublicUnitList
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
    [getNewsListOK]: (state, { payload }) => ({
        ...state,
        newsList: payload
    }),
    [getTipsListOK]: (state, { payload }) => ({
        ...state,
        tipsList: payload
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
