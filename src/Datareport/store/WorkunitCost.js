import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API} from '_platform/api';


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
//施工包
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');

//文档
const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
//文档目录树相关
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');

// //工程量结算关联
const getQuantitiesCode= createFetchAction(`${SERVICE_API}/tags/code/{{code}}/`,[],'GET');  

//搜索
const getSearcher = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_QTO`, [], 'GET');
//删除
const delDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'DELETE');
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE');

export const putDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');

export const actions = {
	getProjectTree,
    uploadStaticFile,
    deleteStaticFile,
	getWorkPackageDetail,
	getAllUsers,
	createWorkflow,
	getWorkflow,
	logWorkflowEvent,
	getWorkpackagesByCode,
	addDocList,
	getScheduleDir,
	postScheduleDir,
	updateWpData,
	getQuantitiesCode,
	getSearcher,
	delDocList,
	deleteWorkflow,
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