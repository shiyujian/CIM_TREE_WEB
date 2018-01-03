import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,FILE_API,NODE_FILE_EXCHANGE_API} from '_platform/api';

//获取项目树
const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
//根据子节点获取父节点
const getTreeRootNode = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&reverse=true`, []);
//获取审核人
const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
//发起流程
const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST');
const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
//附件上传相关
const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);

//批量创建文档
const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
const putDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
//文档目录树相关
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
//删除数据
const deleteDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, [], 'DELETE');
//修改数据
const putDocument = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
//导出数据
const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');

export const actions = {
	getProjectTree,
	getTreeRootNode,
	getAllUsers,
	createWorkflow,
	logWorkflowEvent,
	uploadStaticFile,
	deleteStaticFile,
	getWorkPackageDetail,
	addDocList,
	putDocList,
	getScheduleDir,
	postScheduleDir,
	deleteDocument,
	putDocument,
	jsonToExcel
};

export default handleActions({
	/* [Test]: (state, {payload}) => ({
		...state,
		vedioTest:payload,
	}), */
}, {});