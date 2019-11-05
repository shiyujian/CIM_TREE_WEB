import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    GARDEN_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_MACHINEENTRANCEANDDEPARTURE';
// 获取机械定位设备列表
const getMachineLocationDevices = forestFetchAction(`${GARDEN_API}/locationdevices`, []);
// 获取机械设备进离场列表
const getMachineEntrys = forestFetchAction(`${GARDEN_API}/deviceworks`, []);
// 获取机械设备列表
export const getMachineTypes = forestFetchAction(`${GARDEN_API}/devicetypes`, [], 'GET');
// 获取班组
export const getWorkGroupOK = createAction(`${ID}_getCheckGroup`);
export const actions = {
    getWorkGroupOK,
    getMachineEntrys,
    getMachineLocationDevices,
    getMachineTypes
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
