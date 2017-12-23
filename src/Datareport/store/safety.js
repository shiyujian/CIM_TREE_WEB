import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import createFetchActionWithHeaders from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API} from '_platform/api';

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
//流程
const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE');



export const actions = {
    getScheduleDir,
    postScheduleDir,
    getWorkpackagesByCode,
    addDocList,
    logWorkflowEvent,
    deleteWorkflow,
    getDocument,
   
};
export default handleActions({
	// [getSubTreeOK]: (state, {payload}) =>  {
	// 	return {
	// 		...state,
	// 		subsection: payload.children
	// 	}
	// }
}, {});