import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
// import createFetchAction from 'fetch-action';
import moment from 'moment';
import { MAIN_API, SERVICE_API } from '_platform/api';
const ID = 'trend';

export const getDatumListOK = createAction(`${ID}_getDatumList`);
export const getDatumList = createFetchAction(`${SERVICE_API}/recentdocs/`, [getDatumListOK]);
export const setnewdoc = createAction(`${ID}_setnewdoc`);

// 获取项目安全公告
export const getTipsListOK = createAction('trend获取项目安全公告');
export const getTipsList = createFetchAction(`${MAIN_API}/post/?publisher={{user_id}}&tag=公告&is_draft=false&category=1&time=${moment().valueOf()}`, [getTipsListOK]);
// 获取国内安全动态
export const getNewsListOK = createAction('trend获取国内安全动态');
export const getNewsList = createFetchAction(`${MAIN_API}/post/?publisher={{user_id}}&tag=新闻&is_draft=false&category=2&time=${moment().valueOf()}`, [getNewsListOK]);

// 获取安全事故快报
export const getTrenListOK = createAction('xhy获取安全事故快报');
export const getTrenList = createFetchAction(`${MAIN_API}/post/?publisher={{user_id}}&tag=公告&is_draft=false&category=3&time=${moment().valueOf()}`, [getTrenListOK]);

// 获取安全生产视频
export const getVideoListOK = createAction('xhy获取安全生产视频');
export const getVideoList = createFetchAction(`${MAIN_API}/post/?publisher={{user_id}}&tag=公告&is_draft=false&category=5&time=${moment().valueOf()}`, [getVideoListOK]);

export const actions = {
    getNewsListOK,
    getNewsList,
    getDatumListOK,
    getDatumList,
    setnewdoc,

    getTipsListOK,
    getTipsList,
    getTrenListOK,
    getTrenList,
    getVideoListOK,
    getVideoList
};

export default handleActions(
    {
        [getNewsListOK]: (state, { payload }) => ({
            ...state,
            domesticList: payload
        }),
        [getDatumListOK]: (state, { payload }) => ({
            ...state,
            Doc: payload.result
        }),
        [setnewdoc]: (state, { payload }) => ({
            ...state,
            NewDoc: payload
        }),

        [getTipsListOK]: (state, { payload }) => ({
            ...state,
            TipsList: payload
        }),
        [getTrenListOK]: (state, { payload }) => ({
            ...state,
            trenList: payload
        }),
        [getVideoListOK]: (state, { payload }) => ({
            ...state,
            videoList: payload
        })
    },
    {}
);
