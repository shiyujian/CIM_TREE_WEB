import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    GARDEN_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_MANENTRANCEANDDEPARTURE';
// 获取人员进离场列表
const getPersonEntrys = forestFetchAction(`${GARDEN_API}/personentrys`, []);
// 获取人员登记列表
const getWorkMans = forestFetchAction(`${GARDEN_API}/workmans`, []);
// 获取工种类型
export const getWorkTypes = forestFetchAction(`${GARDEN_API}/worktypes`, [], 'GET');
// 获取班组
export const getWorkGroupOK = createAction(`${ID}_getCheckGroup`);
export const getWorkGroup = forestFetchAction(`${GARDEN_API}/workgroups`, [getWorkGroupOK], 'GET');
export const actions = {
    getWorkGroupOK,
    getWorkGroup,
    getPersonEntrys,
    getWorkMans,
    getWorkTypes
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
        }
    },
    {}
);
