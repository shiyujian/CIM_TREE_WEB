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
// 苗木养护任务查询
export const getCuringTask = createFetchAction(`${FOREST_API}/curing/curingtasks`, [], 'GET');
// 苗木养护计划详情
export const getCuringMessage = createFetchAction(`${FOREST_API}/curing/curing/{{id}}`, [], 'GET');
// 养护计划制定
export const postCuringTask = createFetchAction(`${FOREST_API}/curing/curing`, [], 'POST');
// 养护计划编辑
export const putCuringTask = createFetchAction(`${FOREST_API}/curing/curing`, [], 'PUT');
// 标识养护任务获取
export const getCuringMark = createFetchAction(`${FOREST_API}/curing/markcuringget?curingid={{id}}&curingman={{curingMan}}`, [], 'GET');
// 养护任务开始
export const getStartCuring = createFetchAction(`${FOREST_API}/curing/startcuring?curingid={{id}}&curingman={{curingMan}}`, [], 'GET');
// 养护任务结束
export const getFinishCuring = createFetchAction(`${FOREST_API}/curing/finishcuring?curingid={{id}}&curingman={{curingMan}}`, [], 'GET');
// 养护任务开始
export const postFeedback = createFetchAction(`${FOREST_API}/curing/feedback`, [], 'POST');
// 养护任务总结
export const postcCmplete = createFetchAction(`${FOREST_API}/curing/complete`, [], 'POST');
// 养护位置上报
export const postCusringPositions = createFetchAction(`${FOREST_API}/curing/cusringpositions`, [], 'POST');
// 获取养护轨迹
export const getCuringPositions = createFetchAction(`${FOREST_API}/curing/curingpositions`, [], 'GET');
// 养护班组新增
export const postCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroup`, [], 'POST');
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
    getCuringTask,
    getCuringMessage,
    postCuringTask,
    putCuringTask,
    getCuringMark,
    getStartCuring,
    getFinishCuring,
    postFeedback,
    postcCmplete,
    postCusringPositions,
    getCuringPositions,
    postCuringGroup,
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
