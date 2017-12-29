import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API,base,NODE_FILE_EXCHANGE_API} from '_platform/api';


const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
export const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');
//获取项目树
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
export const getProjectTreeDetail = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/`, []);
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST')
export const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [])
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
//批量获取施工包
const getdateWpData = createFetchAction(`${SERVICE_API}/wpputlist/code/{{code}}`,[]);
// 获取所有施工进度数据
export const getWorkDataList = createFetchAction(`${SERVICE_API}/searcher/?keyword=rel_doc_workdata&obj_type=C_DOC`, [], 'GET');

//得到质量缺陷
export const fetchDefectDetail = createFetchAction(`${base}/main/api/quality-defect/{{id}}/`,[])
//删除流程
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE')
//批量创建文档
export const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
export const putDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?all=true`, [], 'GET');
// 批量删除
const delDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'DELETE');
//创建文档目录
export const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
//导出数据
const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');
//得到组织机构
const getOrg = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/`,[])
//校验
const getTreeRootNode = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&reverse=true`,[]);
export const actions = {
	getProjectTree,
	getProjectTreeDetail,
    uploadStaticFile,
    deleteStaticFile,
	getWorkPackageDetail,
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
	getWorkDataList,
	delDocList,
	jsonToExcel,
	getTreeRootNode,
	getOrg,
	getdateWpData
};
export default handleActions({
	// [getSubTreeOK]: (state, {payload}) =>  {
	// 	return {
	// 		...state,
	// 		subsection: payload.children
	// 	}
	// }
}, {});