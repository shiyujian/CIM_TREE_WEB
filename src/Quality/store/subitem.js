import {createAction, handleActions, combineActions} from 'redux-actions'
import {createFetchActionWithHeaders} from './fetchAction'
import createFetchAction from 'fetch-action';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API,NODE_FILE_EXCHANGE_API} from '_platform/api'

export const getAreaOK = createAction('获取组织机构树')
export const getArea = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getAreaOK])
export const getTrack = createFetchAction(`${base}/main/api/user/{{ID}}/location/`,[])
export const getRisk = createFetchAction(`${base}/main/api/potential-risk/?status=1`,[])
export const setDefectData = createAction('设置质量缺陷详情数据')
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=4`, [])
export const getWorkpackagesDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?all=true`, [])
export const setWorkpackagesDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`, [], 'PUT')
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST')
export const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [])
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST')
export const fetchUserDetail = createFetchAction(`${USER_API}/users/{{pk}}/`, [])
export const fetchRootOrg = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/?reverse=true`, [])
export const fetchOrgDetail = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`, [])
export const fetchUsersByOrgCode = createFetchAction(`${USER_API}/users/?org_code={{org_code}}`, [])
export const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/`, [])
export const exchangeWordFile = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/render`, [], 'POST')
export const getAllUsers = createFetchAction(`${USER_API}/users/`);
export const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST')
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
//废止流程
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE')

export const actions = {
	getAreaOK,
	getArea,
	getTrack,
	getRisk,
    setDefectData,
    getProjectTree,
    getWorkpackagesDetail,
    setWorkpackagesDetail,
    createWorkflow,
    getWorkflow,
    logWorkflowEvent,
    fetchUserDetail,
    fetchRootOrg,
    fetchOrgDetail,
    fetchUsersByOrgCode,
    getOrgTree,
    exchangeWordFile,
    getAllUsers,
    uploadStaticFile,
    updateWpData,
    deleteStaticFile,
    deleteWorkflow
}
export default handleActions({
	[getAreaOK]: (state, {payload}) => {
		return {
			...state,
			areaLists: payload.children
		}
	},
    [setDefectData]: (state, {payload}) => {
        return {
            ...state,
            defectData: payload.defectData
        }
    },
}, {})
