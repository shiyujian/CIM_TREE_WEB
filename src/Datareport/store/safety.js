import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API,NODE_FILE_EXCHANGE_API} from '_platform/api';

//获取项目树
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);

//文档目录树相关
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');

//施工包
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');

//文档
const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?all=true`, [], 'GET');
const delDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'DELETE');
const getDocumentList = createFetchAction(`${SERVICE_API}/documentgetlist/?key_type=code`,[],'GET');
const putDocument = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
//文档查询
const searchDocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/datareport_safetydoc_1112/?doc_code={{docCode}}&keys={{keys}}&values={{values}}`,[],'GET');
//流程
const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE');

//导出数据
const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');

//组织机构
const getOrg = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/`,[]);
//根据子节点获取父节点
const getTreeRootNode = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&reverse=true`, []);
export const actions = {
    getScheduleDir,
    postScheduleDir,
    getWorkpackagesByCode,
    addDocList,
    logWorkflowEvent,
    deleteWorkflow,
    getDocument,
    delDocList,
    getDocumentList,
    putDocument,
    searchDocument,
    jsonToExcel,
    getTreeRootNode
};
export default handleActions({
	// [getSubTreeOK]: (state, {payload}) =>  {
	// 	return {
	// 		...state,
	// 		subsection: payload.children
	// 	}
	// }
}, {});