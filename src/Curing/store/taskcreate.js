import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SERVICE_API,
    USER_API,
    FOREST_API
} from '_platform/api';

export const ID = 'Forest_curing_taskcreate';
export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);
export const getUsers = createFetchAction(`${USER_API}/users/`, []);

export const getTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, []); //    √
export const getLittleBan = createFetchAction(`${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`, []); //
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 苗木养护计划详情
export const getCuringMessage = createFetchAction(`${FOREST_API}/curing/curing/{{id}}`, [], 'GET');
// 养护计划制定
export const postCuringTask = createFetchAction(`${FOREST_API}/curing/curing`, [], 'POST');
// 获取养护轨迹
export const getCuringPositions = createFetchAction(`${FOREST_API}/curing/curingpositions`, [], 'GET');
// 获取养护班组
export const getCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroups`, [], 'GET');
// 获获取养护类型
export const getcCuringTypes = createFetchAction(`${FOREST_API}/curing/curingtypes`, [], 'GET');
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

export const actions = {
    getTreearea,
    getUsers,
    getTreeNodeList,
    getLittleBan,
    getCuring,
    getCuringMessage,
    postCuringTask,
    getCuringPositions,
    getCuringGroup,
    getcCuringTypes,
    postThinClassesByRegion,
    postTreeLocationNumByRegion,
    getCuringGroupMans,
    changeSelectMap,
    changeCheckedKeys
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    }),
    [changeCheckedKeys]: (state, {payload}) => ({
        ...state,
        checkedKeys: payload
    })
}, {});
