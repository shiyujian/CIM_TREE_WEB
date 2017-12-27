import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API} from '_platform/api';

const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?all=true`, [], 'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE')
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');
const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
export const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
//获取项目树
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST')
export const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [])
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
//上传taglists
const addTagList = createFetchAction(`${SERVICE_API}/taglist/`,[],'POST');
//批量更新tags
const updateTagList = createFetchAction(`${SERVICE_API}/taglist/`,[],'POST');
//批量删除tags
const removeDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'DELETE');
//上传tags
const sendTags = createFetchAction(`${SERVICE_API}/tags/`,[],'POST');
//更新
export const putDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');

//获取施工包详情
const getWorkPackageDetails = createFetchAction(`${SERVICE_API}/workpackages/{{code}}/?all=true`,[]);
const getSearcher = createFetchAction(`${SERVICE_API}/searcher/?keyword={{key}}&obj_type=C_QTO`,[],'GET');
const getStrictSearch = createFetchAction(`${SERVICE_API}/doc_searcher/{{dir_code}}/L001/?doc_code=G01&doc_name=N01&keys=key1,key2&values=value1,value2`,[],'GET');

export const actions = {
	getProjectTree,
    uploadStaticFile,
    deleteStaticFile,
	getWorkPackageDetail,
	getWorkPackageDetails,
	getAllUsers,
	createWorkflow,
	getWorkflow,
	logWorkflowEvent,
	getWorkpackagesByCode,
	deleteWorkflow,
	getScheduleDir,
	postScheduleDir,
	addDocList,
	getDocument,
	addTagList,
	sendTags,
	getSearcher,
	removeDocList,
	putDocList
};
export default handleActions({
	// [getSubTreeOK]: (state, {payload}) =>  {
	// 	return {
	// 		...state,
	// 		subsection: payload.children
	// 	}
	// }
}, {});