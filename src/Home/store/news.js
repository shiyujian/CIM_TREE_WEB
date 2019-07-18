import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import moment from 'moment';
// import createFetchAction from 'fetch-action';
import { MAIN_API } from '_platform/api';
const ID = 'home';
// 获取新闻列表
export const getNewsListOK = createAction('home获取新闻列表');
export const getNewsList = createFetchAction(
    `${MAIN_API}/post/?publisher={{user_id}}&tag=%E6%96%B0%E9%97%BB&is_draft=false&category=4&time=${moment().valueOf()}`,
    [getNewsListOK]
);

// 获取通知列表
export const getTipsListOK = createAction('home获取通知列表');
export const getTipsList = createFetchAction(
    `${MAIN_API}/post/?publisher={{user_id}}&tag=%E5%85%AC%E5%91%8A&is_draft=false&category=4&time=${moment().valueOf()}`,
    [getTipsListOK]
);

export const setnewdoc = createAction(`${ID}_setnewdoc`);

export const setTabActive = createAction('home设置当前选中的tab');
// 新接口 2019-7-17
// 新闻列表
export const getNewsListNewOK = createAction(`${ID}获取新闻列表`);
export const getNewsListNew = fetchAction(`${MAIN_API}/newss`, [getNewsListNewOK]);
// 新闻详情
export const getNewsDetails = fetchAction(`${MAIN_API}/news/{{ID}}`);
// 公告列表
export const getNoticeListOK = createAction(`${ID}获取公告列表`);
export const getNoticeList = fetchAction(`${MAIN_API}/notices`, [getNoticeListOK]);
// 公告详情
export const getNoticeDetails = fetchAction(`${MAIN_API}/notice/{{ID}}`);
export const actions = {
    getNewsListNewOK,
    getNewsListNew,
    getNewsDetails,
    getNoticeListOK,
    getNoticeList,
    getNoticeDetails,

    getNewsListOK,
    getNewsList,
    setnewdoc,
    setTabActive,
    getTipsListOK,
    getTipsList
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
