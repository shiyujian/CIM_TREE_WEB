import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './fetchAction';

import {
    FOREST_API
} from '_platform/api';

export const ID = 'Forest_curing_taskcreate';
export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);

// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 苗木养护计划详情
export const getCuringMessage = createFetchAction(`${FOREST_API}/curing/curing/{{id}}`, [], 'GET');
// 养护任务总结
export const postComplete = createFetchAction(`${FOREST_API}/curing/complete`, [], 'POST');
// 获取养护轨迹
export const getCuringPositions = createFetchAction(`${FOREST_API}/curing/curingpositions`, [], 'GET');
// 获获取养护类型
export const getcCuringTypes = createFetchAction(`${FOREST_API}/curing/curingtypes`, [], 'GET');
// 根据范围查询细班
export const postThinClassesByRegion = createFetchAction(`${FOREST_API}/curing/thinclassesbyregion`, [], 'POST');
// 获取范围内栽植的树木数量
export const postTreeLocationNumByRegion = createFetchAction(`${FOREST_API}/curing/treelocationnumbyregion`, [], 'POST');
export const postForsetPic = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=leader`, [], 'POST');
export const actions = {
    getTreearea,
    getCuring,
    getCuringMessage,
    postComplete,
    getCuringPositions,
    getcCuringTypes,
    postThinClassesByRegion,
    postTreeLocationNumByRegion,
    postForsetPic
};
export default handleActions({
}, {});
