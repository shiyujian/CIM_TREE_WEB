import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API, base, USER_API, WORKFLOW_API} from '_platform/api';

export const getVideoOK = createAction('Get_Video_OK');
export const getVideo = createFetchAction(`${SERVICE_API}/loc-tree/code/CAM_ROOT/`, [getVideoOK]);
export const getCameraTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, []);
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);

export const getSafeMonitor = createFetchAction(`${SERVICE_API}/monitors/code/`, []);
export const getUsers = createFetchAction(`${USER_API}/users/`, []);
export const getUsersOnline = createFetchAction(`${base}/main/api/users-online/`, []);
export const getUserOrgInfo = createFetchAction(`${SERVICE_API}/persons/code/{{CODE}}/?all=true`, []);
export const getOrgs = createFetchAction(`${SERVICE_API}/org-tree/`, []);
export const getOrgsByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{CODE}}/`, []);
export const getRiskProcess = createFetchAction(`${WORKFLOW_API}/instance/`, []);// 获取隐患处理工单
export const getRiskProcessDetail = createFetchAction(`${WORKFLOW_API}/instance/{{ID}}`, []);// 获取隐患工单详情
export const setCameraData = createAction('设置摄像头数据');
export const setVideoData = createAction('设置视频数据');
export const setCameraModalVisible = createAction('设置摄像头窗口可视性');
export const getProjectDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?parent=true`, []);
export const bindCameraToProject = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`, [], 'PUT');
export const setEngineeringPk = createAction('设置单位工程pk');
export const setTreeNodeData = createAction('设置树节点数据');
export const setCameraTreeRefresh = createAction('设置摄像头树刷新');
export const actions = {
    getVideo,
    getCameraTree,
    getProjectTree,
    getSafeMonitor,
    getUsers,
    getUsersOnline,
    getUserOrgInfo,
    getOrgs,
    getOrgsByCode,
    getRiskProcess,
    getRiskProcessDetail,
    setCameraData,
    setVideoData,
    setCameraModalVisible,
    getProjectDetail,
    bindCameraToProject,
    setEngineeringPk,
    setTreeNodeData,
    setCameraTreeRefresh
};

export default handleActions({
    [getVideoOK]: (state, {payload}) => {
        return Object.assign({}, state, {videos: payload.children});
    },
    [setCameraData]: (state, {payload}) => {
        return {
            ...state,
            cameraData: payload.cameraData
        };
    },
    [setVideoData]: (state, {payload}) => {
        return {
            ...state,
            videoData: payload.videoData
        };
    },
    [setCameraModalVisible]: (state, {payload}) => {
        return {
            ...state,
            cameraModalVisible: payload.cameraModalVisible
        };
    },
    [setEngineeringPk]: (state, {payload}) => {
        return {
            ...state,
            engineeringPk: payload.engineeringPk
        };
    },
    [setTreeNodeData]: (state, {payload}) => {
        return {
            ...state,
            treeNodeData: payload.treeNodeData
        };
    },
    [setCameraTreeRefresh]: (state, {payload}) => {
        return {
            ...state,
            cameraTreeRefresh: payload.cameraTreeRefresh
        };
    }
}, {});
