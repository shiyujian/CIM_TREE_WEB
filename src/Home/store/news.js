import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import { NEWS_API } from '_platform/api';
const ID = 'home';

export const setnewdoc = createAction(`${ID}_setnewdoc`);

export const setTabActive = createAction('home设置当前选中的tab');
// 新接口 2019-7-17
// 新闻列表
export const getNewsListNewOK = createAction(`${ID}获取新闻列表`);
export const getNewsListNew = fetchAction(`${NEWS_API}/newss`, [getNewsListNewOK]);
// 新闻详情
export const getNewsDetails = fetchAction(`${NEWS_API}/news/{{ID}}`);
// 公告列表
export const getNoticeListOK = createAction(`${ID}获取公告列表`);
export const getNoticeList = fetchAction(`${NEWS_API}/notices`, [getNoticeListOK]);
// 公告详情
export const getNoticeDetails = fetchAction(`${NEWS_API}/notice/{{ID}}`);
export const actions = {
    getNewsListNewOK,
    getNewsListNew,
    getNewsDetails,
    getNoticeListOK,
    getNoticeList,
    getNoticeDetails,
    setnewdoc,
    setTabActive
};

export default handleActions(
    {
        [getNewsListNewOK]: (state, { payload }) => ({
            ...state,
            newsList: payload.content
        }),
        [getNoticeListOK]: (state, { payload }) => ({
            ...state,
            tipsList: payload.content
        }),
        [setnewdoc]: (state, { payload }) => ({
            ...state,
            NewDoc: payload
        }),
        [setTabActive]: (state, { payload }) => ({
            ...state,
            tabValue: payload
        })
    },
    {}
);
