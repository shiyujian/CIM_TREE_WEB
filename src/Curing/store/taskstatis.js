import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API
} from '_platform/api';

export const ID = 'Forest_curing_taskcreate';
export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);

// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 苗木养护计划详情
export const getCuringMessage = createFetchAction(`${FOREST_API}/curing/curing/{{id}}`, [], 'GET');
// 获取养护轨迹
export const getCuringPositions = createFetchAction(`${FOREST_API}/curing/curingpositions`, [], 'GET');
// 获取养护班组
export const getCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroups`, [], 'GET');
// 获取班组人员
export const getCuringGroupMans = createFetchAction(`${FOREST_API}/curing/curinggroupmans?groupid={{groupid}}`, [], 'GET');
// 修改选择地图的方式
export const changeTaskStatisGisVisible = createAction(`${ID}_changeTaskStatisTableVisible`);
// 修改选择地图的方式
export const changeTaskStatisSelectTask = createAction(`${ID}_changeTaskStatisSelectTask`);
// 获获取任务统计
export const getcCuringStat = createFetchAction(`${FOREST_API}/curing/curingstat`, [], 'GET');

export const actions = {
    getTreearea,
    getCuring,
    getCuringMessage,
    getCuringPositions,
    getCuringGroup,
    getCuringGroupMans,
    changeTaskStatisGisVisible,
    changeTaskStatisSelectTask,
    getcCuringStat
};
export default handleActions({
    [changeTaskStatisGisVisible]: (state, {payload}) => ({
        ...state,
        taskStatisGisVisible: payload
    }),
    [changeTaskStatisSelectTask]: (state, {payload}) => ({
        ...state,
        taskStatisSelectTask: payload
    })
}, {});
