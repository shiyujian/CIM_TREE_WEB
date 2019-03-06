import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
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
export const actions = {
    getNewsListOK,
    getNewsList,
    setnewdoc,
    setTabActive,
    getTipsListOK,
    getTipsList
};

export default handleActions(
    {
        [getNewsListOK]: (state, { payload }) => ({
            ...state,
            newsList: payload
        }),
        [setnewdoc]: (state, { payload }) => ({
            ...state,
            NewDoc: payload
        }),
        [setTabActive]: (state, { payload }) => ({
            ...state,
            tabValue: payload
        }),

        [getTipsListOK]: (state, { payload }) => ({
            ...state,
            tipsList: payload
        })
    },
    {}
);
