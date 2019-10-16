import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import {
    CURING_API
} from '_platform/api';

export const ID = 'Forest_curing_taskcreate';
// 苗木养护查询
export const getCuring = forestFetchAction(`${CURING_API}/curings`, [], 'GET');
// 获取养护轨迹
export const getCuringPositions = forestFetchAction(`${CURING_API}/curingpositions`, [], 'GET');
// 获取养护班组
export const getCuringGroup = forestFetchAction(`${CURING_API}/curinggroups`, [], 'GET');
// 获取班组人员
export const getCuringGroupMans = forestFetchAction(`${CURING_API}/curinggroupmans?groupid={{groupid}}`, [], 'GET');
// 修改选择地图的方式
export const changeTaskStatisGisVisible = createAction(`${ID}_changeTaskStatisTableVisible`);
// 修改选择地图的方式
export const changeTaskStatisSelectTask = createAction(`${ID}_changeTaskStatisSelectTask`);
// 获获取任务统计
export const getcCuringStat = forestFetchAction(`${CURING_API}/curingstat`, [], 'GET');

export const actions = {
    getCuring,
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
