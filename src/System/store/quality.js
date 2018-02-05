import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API,base,NODE_FILE_EXCHANGE_API} from '_platform/api';


const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
export const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
//获取项目树
//export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
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
//批量删除文档
const delDocList = createFetchAction(`${SERVICE_API}/documentlist/?code_list={{code_list}}`,[],'DELETE');
const getDocumentList = createFetchAction(`${SERVICE_API}/documentgetlist/?key_type=code`,[],'GET');
//创建文档目录
export const addDefectDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
//文档目录树相关
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
//获取资源的api	
const getResouce = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type={{obj_type}}`,[])
const getRelDoc = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[])
//得到组织机构
const getOrg = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/`,[])
//获取项目树
const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=4`, []);
//导出数据
const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');
//根据子节点获取父节点
const getTreeRootNode = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&reverse=true`, []);
//文档查询
const searchDocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/datareport_safetydoc_1112/?doc_code={{docCode}}&keys={{keys}}&values={{values}}`,[],'GET');
export const actions = {
	getProjectTree,
    uploadStaticFile,
    deleteStaticFile,
	getWorkPackageDetail,
	getAllUsers,
	createWorkflow,
	getWorkflow,
	logWorkflowEvent,
	fetchDefectDetail,
	putDocList,
	addDocList,
	deleteWorkflow,
	updateWpData,
	addDefectDir,
	getScheduleDir,
	postScheduleDir,
	getResouce,
	getRelDoc,
	getOrg,
	delDocList,
	getTreeRootNode,
	jsonToExcel,
	searchDocument,
	getDocumentList
};
export default handleActions({
	// [getSubTreeOK]: (state, {payload}) =>  {
	// 	return {
	// 		...state,
	// 		subsection: payload.children
	// 	}
	// }
}, {});