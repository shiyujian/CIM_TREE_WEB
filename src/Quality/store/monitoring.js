import {createAction, handleActions, combineActions} from 'redux-actions'
import {createFetchActionWithHeaders} from './fetchAction'
import createFetchAction from 'fetch-action';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API} from '_platform/api'

export const getAreaOK = createAction('获取组织机构树')
export const getArea = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getAreaOK])
export const getTrack = createFetchAction(`${base}/main/api/user/{{ID}}/location/`,[])
export const getRisk = createFetchAction(`${base}/main/api/potential-risk/?status=1`,[])
export const getVedio = createFetchAction(`${SERVICE_API}/loc-tree/code/CAM_ROOT/`,[])
export const getSafeMonitor = createFetchAction(`${SERVICE_API}/monitors/code/`,[])
export const getUsers = createFetchAction(`${USER_API}/users/`,[])
export const getUsersOnline = createFetchAction(`${base}/main/api/users-online/`,[])
export const getUserOrgInfo = createFetchAction(`${SERVICE_API}/persons/code/{{CODE}}/?all=true`,[])
export const getOrgs = createFetchAction(`${SERVICE_API}/org-tree/`,[])
export const getOrgsByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{CODE}}/`,[])
export const getRiskProcess = createFetchAction(`${WORKFLOW_API}/instance/`,[])//获取隐患处理工单
export const getRiskProcessDetail = createFetchAction(`${WORKFLOW_API}/instance/{{ID}}`,[])//获取隐患工单详情
export const getRiskContactSheet = createFetchAction(`${base}/main/api/potential-risk/{{ID}}/contact-sheet/`,[])
export const getCameraTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, [])
export const setCameraData = createAction('设置摄像头数据')
export const setVideoData = createAction('设置视频数据')
export const setCameraModalVisible = createAction('设置摄像头窗口可视性')
export const getProjectDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?parent=true`, [])
export const bindCameraToProject = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`, [], 'PUT')
export const getStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [])
export const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST')
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')
export const getInspectRecordDocument = createFetchAction(`${SERVICE_API}/documents/{{pk}}`,[])
export const setInspectRecordDocument = createFetchAction(`${SERVICE_API}/documents/`,[],'POST')
export const delInspectRecordDocument = createFetchAction(`${SERVICE_API}/documents/{{pk}}/?this=true`,[],'DELETE')
export const setEngineeringPk = createAction('设置单位工程pk')
export const actions = {
	getAreaOK,
	getArea,
	getTrack,
	getRisk,
	getVedio,
	getSafeMonitor,
	getUsers,
	getUsersOnline,
	getUserOrgInfo,
	getOrgs,
	getRiskProcess,
	getRiskProcessDetail,
	getRiskContactSheet,
	getOrgsByCode,
    getCameraTree,
    setCameraData,
    setCameraModalVisible,
    getProjectDetail,
    bindCameraToProject,
    setVideoData,
    getStaticFile,
    uploadStaticFile,
    deleteStaticFile,
    getInspectRecordDocument,
    setInspectRecordDocument,
    delInspectRecordDocument,
    setEngineeringPk,
}
export default handleActions({
	[getAreaOK]: (state, {payload}) => {
		return {
			...state,
			areaLists: payload.children
		}
	},
    [setCameraData]: (state, {payload}) => {
        return {
            ...state,
            cameraData: payload.cameraData
        }
    },
    [setVideoData]: (state, {payload}) => {
        return {
            ...state,
            videoData: payload.videoData
        }
    },
    [setCameraModalVisible]: (state, {payload}) => {
        return {
            ...state,
            cameraModalVisible: payload.cameraModalVisible
        }
    },
    [setEngineeringPk]: (state, {payload}) => {
        return {
            ...state,
            engineeringPk: payload.engineeringPk
        }
    }
}, {})
