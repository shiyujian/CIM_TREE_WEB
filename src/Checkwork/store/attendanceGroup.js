import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SYSTEM_API
} from '_platform/api';
export const ID = 'Checkwork_attendancegroup';
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
export const getCheckGroup = createFetchAction(`${SYSTEM_API}/checkgroups`, [getCheckGroupOK], 'GET');
// 增加考勤群体
export const postCheckGroup = createFetchAction(`${SYSTEM_API}/checkgroup`, [], 'POST');
// 删除考勤群体
export const deleteCheckGroup = createFetchAction(`${SYSTEM_API}/checkgroup/{{id}}`, [], 'DELETE');
// 获取群体成员
export const getCheckGroupMans = createFetchAction(`${SYSTEM_API}/groupusers?groupId={{groupId}}`, [], 'GET');
// 增加群体成员/删除群体成员
export const putCheckGroupMans = createFetchAction(`${SYSTEM_API}/groupuser`, [], 'PUT');
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
    putCheckGroupMans,
    checkGroupMemChangeStatus
};
export default handleActions({
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
    [getCheckGroupOK]: (state, {payload}) => {
        if (payload && payload.content && payload.content instanceof Array) {
            let data = {
                checkGroupsData: payload.content
            };
            return data;
        } else {
            return {checkGroupsData: []};
        }
    }
}, {});
