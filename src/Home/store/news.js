import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import { NEWS_API, GARDEN_API, FOREST_API } from '_platform/api';
const ID = 'home';

export const setnewdoc = createAction(`${ID}_setnewdoc`);

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
// 获取今日人员投入
export const getWorkMansbyday = fetchAction(`${GARDEN_API}/workmansbyday`, [], 'GET');
// 获取今日机械投入
export const getDeviceWorksbyday = fetchAction(`${GARDEN_API}/deviceworksbyday`, [], 'GET');
// 获取人员每日进离场统计
export const getStatworkmans = fetchAction(`${GARDEN_API}/statworkmans`, [], 'GET');
// 根据类型获取苗木相关信息
export const getTotalstat = fetchAction(`${FOREST_API}/bigdata/totalstat`, [], 'GET');
// 根据标段获取天气相关信息
export const getEnvs = fetchAction(`${GARDEN_API}/envs`, [], 'GET');
// 根据标段获取机械相关信息
export const getStatdevice4total = fetchAction(`${GARDEN_API}/statdevice4total`, [], 'GET');
// 根据标段获取园林附属设施相关信息
export const getGardentotalstat = fetchAction(`${FOREST_API}/bigdata/gardentotalstat`, [], 'GET');

export const actions = {
    getNewsListNewOK,
    getNewsListNew,
    getNewsDetails,
    getNoticeListOK,
    getNoticeList,
    getNoticeDetails,
    setnewdoc,
    getWorkMansbyday,
    getDeviceWorksbyday,
    getStatworkmans,
    getTotalstat,
    getEnvs,
    getStatdevice4total,
    getGardentotalstat
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
        })
    },
    {}
);
