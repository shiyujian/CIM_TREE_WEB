import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API,
    base
} from '_platform/api';

export const ID = 'Checkwork_electronicfence';

export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);

// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 养护计划制定
export const postCuringTask = createFetchAction(`${FOREST_API}/curing/curing`, [], 'POST');
// 获取养护轨迹
export const getCuringPositions = createFetchAction(`${FOREST_API}/curing/curingpositions`, [], 'GET');
// 获取养护班组
export const getCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroups`, [], 'GET');
// 根据范围查询细班
export const postThinClassesByRegion = createFetchAction(`${FOREST_API}/curing/thinclassesbyregion`, [], 'POST');
// 获取范围内栽植的树木数量
export const postTreeLocationNumByRegion = createFetchAction(`${FOREST_API}/curing/treelocationnumbyregion`, [], 'POST');
// 获取班组人员
export const getCuringGroupMans = createFetchAction(`${FOREST_API}/curing/curinggroupmans?groupid={{groupid}}`, [], 'GET');
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);
// 修改选中节点
export const changeCheckedKeys = createAction(`${ID}_changeCheckedKeys`);

//获取考勤群体
export const getCheckGroup = createFetchAction(`${base}/main/api/check-group/`, [], 'GET');

//获取群体下的所有围栏
export const getCheckScope = createFetchAction(`${base}/main/api/group/{{id}}/scope/`, [], 'GET');

//为群体设置电子围栏
export const postCheckScope = createFetchAction(`${base}/main/api/group/{{id}}/scope/`, [], 'POST');

export const getTeamsTree = createAction(`${ID}获取所有的考勤群体数据`);

export const actions = {
    getTreearea,
    getCuring,
    postCuringTask,
    getCuringPositions,
    getCuringGroup,
    postThinClassesByRegion,
    postTreeLocationNumByRegion,
    getCuringGroupMans,
    changeSelectMap,
    changeCheckedKeys,
    getCheckGroup,
    getCheckScope,
    postCheckScope,
    getTeamsTree,
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    }),
    [changeCheckedKeys]: (state, {payload}) => ({
        ...state,
        checkedKeys: payload
    }),
    [getTeamsTree]: (state, { payload }) => ({
        ...state,
        teamsTree: payload
    })
}, {});
