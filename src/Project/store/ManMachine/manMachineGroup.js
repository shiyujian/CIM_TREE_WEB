import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    GARDEN_API,
    SYSTEM_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_MANMACHINEGROUP';
// 获取班组
export const getWorkGroupOK = createAction(`${ID}_getCheckGroup`);
export const getWorkGroup = forestFetchAction(`${GARDEN_API}/workgroups`, [getWorkGroupOK], 'GET');
// 新增班组
export const postWorkGroup = forestFetchAction(`${GARDEN_API}/workgroup`, [], 'POST');
// 编辑班组
export const putWorkGroup = forestFetchAction(`${GARDEN_API}/workgroup`, [], 'PUT');
// 删除班组
export const deletWorkGroup = forestFetchAction(`${GARDEN_API}/workgroup/{{id}}`, [], 'DELETE');
// 修改所选择节点的班组
export const changeSelectMemGroup = createAction(`${ID}_changeSelectMemGroup`);
// 获取班组的人员数据
export const getWorkMans = forestFetchAction(`${GARDEN_API}/workmans`, [], 'GET');
// 删除人员登记信息
export const deleteWorkman = forestFetchAction(`${GARDEN_API}/workman/{{id}}`, [], 'DELETE');
// 修改所选节点的状态
export const changeSelectState = createAction(`${ID}_changeSelectState`);
// 修改左侧树的loading
export const changeAsideTreeLoading = createAction(`${ID}_changeAsideTreeLoading`);
// 群组增加删减人员后，需要对redux中群体人员的信息进行更新，根据这个状态判断是否需要更新
export const workGroupMemChangeStatus = createAction(`${ID}_checkGroupMemChangeStatus`);
// 获取工种类型
export const getWorkTypes = forestFetchAction(`${GARDEN_API}/worktypes`, [], 'GET');
// 人员编辑
export const putWorkman = forestFetchAction(`${GARDEN_API}/workman`, [], 'PUT');

export const actions = {
    getWorkGroupOK,
    getWorkGroup,
    postWorkGroup,
    putWorkGroup,
    deletWorkGroup,
    getWorkMans,
    changeSelectMemGroup,
    changeSelectState,
    changeAsideTreeLoading,
    workGroupMemChangeStatus,
    getWorkTypes,
    deleteWorkman,
    putWorkman
};

export default handleActions(
    {
        [getWorkGroupOK]: (state, {payload}) => {
            if (payload && payload.content && payload.content instanceof Array) {
                let data = {
                    workGroupsData: payload.content
                };
                return data;
            } else {
                return {
                    workGroupsData: []
                };
            }
        },
        [changeSelectMemGroup]: (state, {payload}) => ({
            ...state,
            selectMemGroup: payload
        }),
        [changeSelectState]: (state, {payload}) => ({
            ...state,
            selectState: payload
        }),
        [changeAsideTreeLoading]: (state, {payload}) => ({
            ...state,
            asideTreeLoading: payload
        }),
        [workGroupMemChangeStatus]: (state, {payload}) => ({
            ...state,
            memberChangeStatus: payload
        })
    },

    {}
);
