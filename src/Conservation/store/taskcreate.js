import { createAction, handleActions } from 'redux-actions';
// import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import {
    CURING_API
} from '_platform/api';

export const ID = 'Forest_curing_taskcreate';
// 苗木养护查询
export const getCuring = forestFetchAction(`${CURING_API}/curings`, [], 'GET');
// 养护计划制定
export const postCuringTask = forestFetchAction(`${CURING_API}/curing`, [], 'POST');
// 获取养护轨迹
export const getCuringPositions = forestFetchAction(`${CURING_API}/curingpositions`, [], 'GET');
// 获取养护班组
export const getCuringGroup = forestFetchAction(`${CURING_API}/curinggroups`, [], 'GET');
// 根据范围查询细班
export const postThinClassesByRegion = forestFetchAction(`${CURING_API}/thinclassesbyregion`, [], 'POST');
// 获取范围内栽植的树木数量
export const postTreeLocationNumByRegion = forestFetchAction(`${CURING_API}/treelocationnumbyregion`, [], 'POST');
// 获取班组人员
export const getCuringGroupMans = forestFetchAction(`${CURING_API}/curinggroupmans?groupid={{groupid}}`, [], 'GET');
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);
// 修改选中节点
export const changeCheckedKeys = createAction(`${ID}_changeCheckedKeys`);

export const actions = {
    getCuring,
    postCuringTask,
    getCuringPositions,
    getCuringGroup,
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
