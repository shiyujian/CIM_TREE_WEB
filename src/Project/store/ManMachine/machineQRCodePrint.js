import { handleActions, createAction } from 'redux-actions';
import {
    GARDEN_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_MACHINEQRCODEPRINT';
// 获取机械定位设备列表
const getLocationDevices = forestFetchAction(`${GARDEN_API}/locationdevices`, []);
// 机械定位设备增加
const postLocationDevice = forestFetchAction(`${GARDEN_API}/locationdevice`, [], 'POST');
// 删除机械定位设备
const deleteLocationDevice = forestFetchAction(`${GARDEN_API}/locationdevice/{{id}}`, [], 'DELETE');
// 获取机械定位设备详情
export const getLocationDeviceDetail = forestFetchAction(`${GARDEN_API}/locationdevice/{{carNo}}`, [], 'GET');
// 获取班组
export const getWorkGroupOK = createAction(`${ID}_getCheckGroup`);
export const getWorkGroup = forestFetchAction(`${GARDEN_API}/workgroups`, [getWorkGroupOK], 'GET');
export const actions = {
    getWorkGroupOK,
    getWorkGroup,
    getLocationDevices,
    postLocationDevice,
    deleteLocationDevice,
    getLocationDeviceDetail
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
