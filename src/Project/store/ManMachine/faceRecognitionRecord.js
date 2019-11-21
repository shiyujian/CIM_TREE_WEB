import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    GARDEN_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_FACERECOGNITIONRECORD';
// 获取人脸识别记录
const getFaceRecords = forestFetchAction(`${GARDEN_API}/facerecords`, []);
// 获取工种类型
export const getWorkTypes = forestFetchAction(`${GARDEN_API}/worktypes`, [], 'GET');
// 获取班组
export const getFaceDevicesOK = createAction(`${ID}_getFaceDevicesOK`);
export const getFaceDevices = forestFetchAction(`${GARDEN_API}/facedevices`, [getFaceDevicesOK], 'GET');
export const actions = {
    getFaceDevices,
    getFaceDevicesOK,
    getWorkTypes,
    getFaceRecords
};

export default handleActions(
    {
        [getFaceDevicesOK]: (state, {payload}) => {
            if (payload && payload instanceof Array) {
                let data = {
                    faceDevicesData: payload
                };
                return data;
            } else {
                return {
                    faceDevicesData: []
                };
            }
        }
    },
    {}
);
