import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    GARDEN_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'PROJECT_FACERECOGNITIONLIST';
// 获取人脸识别设备列表
const getFaceRecognitionList = forestFetchAction(`${GARDEN_API}/facedevices`, []);
// 获取人脸识别人员列表
export const getFaceworkmans = forestFetchAction(`${GARDEN_API}/faceworkmans?sn={{sn}}`, [], 'GET');
// 重新下发人员到人脸识别机
export const postReSendManToFaceDevice = forestFetchAction(`${GARDEN_API}/resendman2facedevice?id={{id}}`, [], 'GET');
// 获取班组
export const getWorkGroupOK = createAction(`${ID}_getCheckGroup`);
export const actions = {
    getWorkGroupOK,
    getFaceRecognitionList,
    getFaceworkmans,
    postReSendManToFaceDevice
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
