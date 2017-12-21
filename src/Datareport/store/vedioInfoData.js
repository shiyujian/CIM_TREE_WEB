import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,FILE_API} from '_platform/api';

const Test = createAction('测试redux');
//获取审核人
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
//发起流程
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST');
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');

//附件上传相关
const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
//获取文档目录
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');

export const actions = {
	Test,
	getAllUsers,
	createWorkflow,
	logWorkflowEvent,
	uploadStaticFile,
	deleteStaticFile,
	getWorkPackageDetail,
	getScheduleDir
};

export default handleActions({
	[Test]: (state, {payload}) => ({
		...state,
		vedioTest:payload,
	}),
}, {});