import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SERVICE_API,
    FOREST_API,
    base
} from '_platform/api';
export const ID = 'Checkwork_attendancegroup';
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);
// 修改左侧树的loading
export const changeAsideTreeLoading = createAction(`${ID}_changeAsideTreeLoading`);

// 修改关联用户Modal的visible
export const changeAddMemVisible = createAction(`${ID}_changeAddMemVisible`);
// 修改所选节点的状态
export const changeSelectState = createAction(`${ID}_changeSelectState`);
// 修改所选择节点的群体
export const changeSelectMemGroup = createAction(`${ID}_changeSelectMemGroup`);
// 获取考勤群体
export const getCheckGroupOK = createAction(`${ID}_getCheckGroup`);
export const getCheckGroup = createFetchAction(`${base}/main/api/check-group/`, [getCheckGroupOK], 'GET');
// 增加考勤群体
export const postCheckGroup = createFetchAction(`${base}/main/api/check-group/`, [], 'POST');
// 删除考勤群体
export const deleteCheckGroup = createFetchAction(`${base}/main/api/check-group/{{id}}/`, [], 'DELETE');
// 将人员信息上传至redux
export const getCheckGroupMansOk = createAction(`${ID}_getCheckGroupMansOk`);
// 获取群体成员
export const getCheckGroupMans = createFetchAction(`${base}/main/api/group/{{id}}/members/`, [getCheckGroupMansOk], 'GET');
// 获取群体成员的ID列表
export const getCheckGroupMansIDList = createFetchAction(`${base}/main/api/group/{{id}}/members/id-list/`, [], 'GET');

// 增加群体成员/删除群体成员
export const postCheckGroupMans = createFetchAction(`${base}/main/api/group/{{id}}/members/`, [], 'POST');
// 群组增加删减人员后，需要对redux中群体人员的信息进行更新，根据这个状态判断是否需要更新
export const checkGroupMemChangeStatus = createAction(`${ID}_checkGroupMemChangeStatus`);

export const actions = {
    changeAsideTreeLoading,
    changeAddMemVisible,
    changeSelectMemGroup,
    changeSelectState,
    getCheckGroupOK,
    getCheckGroup,
    postCheckGroup,
    deleteCheckGroup,
    getCheckGroupMans,
    postCheckGroupMans,
    getCheckGroupMansOk,
    getCheckGroupMansIDList,
    checkGroupMemChangeStatus
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    }),
    [changeAsideTreeLoading]: (state, {payload}) => ({
        ...state,
        asideTreeLoading: payload
    }),
    [changeAddMemVisible]: (state, {payload}) => ({
        ...state,
        addMemVisible: payload
    }),
    [checkGroupMemChangeStatus]: (state, {payload}) => ({
        ...state,
        memberChangeStatus: payload
    }),
    [changeSelectMemGroup]: (state, {payload}) => ({
        ...state,
        selectMemGroup: payload
    }),
    [changeSelectState]: (state, {payload}) => ({
        ...state,
        selectState: payload
    }),
    [getCheckGroupOK]: (state, {payload}) => ({
        ...state,
        checkGroupsData: payload
    }),
    [getCheckGroupMansOk]: (state, {payload}) => ({
        ...state,
        checkGroupMans: payload
    })
}, {});
