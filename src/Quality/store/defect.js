import {createAction, handleActions, combineActions} from 'redux-actions'
import {createFetchActionWithHeaders} from './fetchAction'
import createFetchAction from 'fetch-action';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API} from '_platform/api'

export const getAreaOK = createAction('获取组织机构树')
export const getArea = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getAreaOK])
export const getTrack = createFetchAction(`${base}/main/api/user/{{ID}}/location/`,[])
export const getRisk = createFetchAction(`${base}/main/api/potential-risk/?status=1`,[])
export const setDefectData = createAction('设置质量缺陷详情数据')
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=4`, [])
export const getProjectDetail = createFetchAction(`${SERVICE_API}/projects/{{pk}}/`, [])
export const getWorkpackagesDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?parent=true&children=true`, [])
export const fetchDefectDataByLoc = createFetchAction(`${base}/main/api/quality-defect/?project_location={{keyword}}`,[])
export const fetchDefectDetail = createFetchAction(`${base}/main/api/quality-defect/{{id}}/`,[])
export const fetchDefectContactSheet = createFetchAction(`${base}/main/api/quality-defect/{{id}}/contact-sheet/`,[])
export const fetchDefectResponseSheet = createFetchAction(`${base}/main/api/quality-defect/{{id}}/response-sheet/`,[])
//搜索得到流程
export const getWorkflowInstance = createFetchAction(`${WORKFLOW_API}/instance/?code=TEMPLATE_020&subject_id={{id}}`,[])
export const getWorkflowDetail = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}`,[])
// export const htmlToPdf = createFetchAction(`${}`);
export const actions = {
	getAreaOK,
	getArea,
	getTrack,
	getRisk,
    setDefectData,
    getProjectTree,
    getProjectDetail,
    getWorkpackagesDetail,
    fetchDefectDataByLoc,
    fetchDefectDetail,
    fetchDefectContactSheet,
    fetchDefectResponseSheet,
    getWorkflowInstance,
    getWorkflowDetail
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
