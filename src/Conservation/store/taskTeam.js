import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import {
    CURING_API
} from '_platform/api';

export const ID = 'Forest_curing_taskteam';

// 修改关联用户Modal的visible
export const changeAddMemVisible = createAction(`${ID}_changeAddMemVisible`);
// 修改所选择标段，以查找人员
export const changeSelectSection = createAction(`${ID}_changeSelectSection`);
// 修改所选节点的状态
export const changeSelectState = createAction(`${ID}_changeSelectState`);
// 养护班组新增
export const postCuringGroup = forestFetchAction(`${CURING_API}/curinggroup`, [], 'POST');
// 获取养护班组
export const getCuringGroup = forestFetchAction(`${CURING_API}/curinggroups`, [], 'GET');
// 删除养护班组
export const deleteCuringGroup = forestFetchAction(`${CURING_API}/curinggroup/{{ID}}`, [], 'DELETE');
// 修改所选择节点的班组
export const changeSelectMemTeam = createAction(`${ID}_changeSelectMemTeam`);
// 养护班组新增人员
export const postCuringGroupMan = forestFetchAction(`${CURING_API}/curinggroupman`, [], 'POST');
// 将人员信息上传至redux
export const getCuringGroupMansOk = createAction(`${ID}_getCuringGroupMansOk`);
// 获取养护班组人员
export const getCuringGroupMans = forestFetchAction(`${CURING_API}/curinggroupmans?groupid={{groupid}}`, [getCuringGroupMansOk], 'GET');
// 获取养护班组
export const deleteCuringGroupMan = forestFetchAction(`${CURING_API}/curinggroupman/{{id}}`, [], 'DELETE');

export const actions = {
    changeAddMemVisible,
    changeSelectSection,
    changeSelectMemTeam,
    changeSelectState,
    postCuringGroup,
    getCuringGroup,
    deleteCuringGroup,
    postCuringGroupMan,
    getCuringGroupMans,
    getCuringGroupMansOk,
    deleteCuringGroupMan
};
export default handleActions({
    [changeAddMemVisible]: (state, {payload}) => ({
        ...state,
        addMemVisible: payload
    }),
    [changeSelectSection]: (state, {payload}) => ({
        ...state,
        selectSection: payload
    }),
    [changeSelectMemTeam]: (state, {payload}) => ({
        ...state,
        selectMemTeam: payload
    }),
    [changeSelectState]: (state, {payload}) => ({
        ...state,
        selectState: payload
    }),
    [getCuringGroupMansOk]: (state, {payload}) => ({
        ...state,
        curingGroupMans: payload
    })
}, {});
