import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import {createFetchActionWithHeaders as myFetch} from './fetchAction';

import {
    UPLOAD_API,
    CURING_API
} from '_platform/api';

export const ID = 'Forest_curing_taskcreate';
// 苗木养护查询
export const getCuring = forestFetchAction(`${CURING_API}/curings`, [], 'GET');
// 养护任务总结
export const postComplete = forestFetchAction(`${CURING_API}/complete`, [], 'POST');
// 获取养护轨迹
export const getCuringPositions = forestFetchAction(`${CURING_API}/curingpositions`, [], 'GET');
// 根据范围查询细班
export const postThinClassesByRegion = forestFetchAction(`${CURING_API}/thinclassesbyregion`, [], 'POST');
// 获取范围内栽植的树木数量
export const postTreeLocationNumByRegion = forestFetchAction(`${CURING_API}/treelocationnumbyregion`, [], 'POST');
export const postForsetPic = myFetch(`${UPLOAD_API}?filetype=leader`, [], 'POST');
export const actions = {
    getCuring,
    postComplete,
    getCuringPositions,
    postThinClassesByRegion,
    postTreeLocationNumByRegion,
    postForsetPic
};
export default handleActions({
}, {});
