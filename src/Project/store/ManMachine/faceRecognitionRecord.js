import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    GARDEN_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_FACERECOGNITIONRECORD';
// 获取机械定位设备列表
const getFaceWorkmans = forestFetchAction(`${GARDEN_API}/faceworkmans`, []);
// 获取工种类型
export const getWorkTypes = forestFetchAction(`${GARDEN_API}/worktypes`, [], 'GET');
// 获取班组
export const getWorkGroupOK = createAction(`${ID}_getCheckGroup`);
export const getWorkGroup = forestFetchAction(`${GARDEN_API}/workgroups`, [getWorkGroupOK], 'GET');
export const actions = {
    getWorkGroup,
    getWorkGroupOK,
    getWorkTypes,
    getFaceWorkmans
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
