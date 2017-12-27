import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API,base} from '_platform/api';


const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
export const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
export const getWorkPackageDetailpk = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?all=true`,[]);
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');
//获取项目树
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST')
export const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [])
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
//得到质量缺陷
export const fetchDefectDetail = createFetchAction(`${base}/main/api/quality-defect/{{id}}/`,[])
//删除流程
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE')
//批量创建文档
export const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
export const putDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?all=true`, [], 'GET');
const putDocument = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
// 批量删除
const delDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'DELETE');
//创建文档目录
export const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
export const actions = {
	getProjectTree,
    uploadStaticFile,
    deleteStaticFile,
	getWorkPackageDetail,
	getWorkPackageDetailpk,
	getWorkpackagesByCode,
	getAllUsers,
	getDocument,
	createWorkflow,
	getWorkflow,
	logWorkflowEvent,
	fetchDefectDetail,
	putDocList,
	addDocList,
	deleteWorkflow,
	updateWpData,
	postScheduleDir,
	getScheduleDir,
	delDocList,
	putDocument
};
export default handleActions({
	// [getSubTreeOK]: (state, {payload}) =>  {
	// 	return {
	// 		...state,
	// 		subsection: payload.children
	// 	}
	// }
}, {});