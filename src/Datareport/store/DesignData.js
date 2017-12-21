import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {USER_API, SERVICE_API,WORKFLOW_API,FILE_API} from '_platform/api';
export const ID = 'DATA_DESIGNDATA';

const additionReducer = fieldFactory(ID, 'addition');
const checkReducer = fieldFactory(ID, 'check');
const modifyReducer = fieldFactory(ID, 'modify');
const expurgateReducer = fieldFactory(ID, 'expurgate');

const getFieldsOK = createAction(`${ID}_GET_FIELD_OK`);

const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');
export const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
export const getWorkPackageDetailpk = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?all=true`,[]);
//获取项目树
export const getProjectTree = createFetchAction(`${SERVICE_API}/project-tree/`, []);
export const getProjectTreeDetail = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/`, []);
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST')
export const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [])
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
//批量创建文档
export const addDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
export const putDocList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
//批量创建目录
export const addDirList = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');
export const putDirList = createFetchAction(`${SERVICE_API}/directories/`,[],'PUT');


export const actions = {
	...additionReducer,
	...checkReducer,
	...modifyReducer,
	...expurgateReducer,
	getProjectTree,
	getProjectTreeDetail,
	getWorkPackageDetailpk,
    uploadStaticFile,
    deleteStaticFile,
	getWorkPackageDetail,
	getAllUsers,
	createWorkflow,
	getWorkflow,
	logWorkflowEvent,
	updateWpData,
	addDocList,
	putDocList,
	addDirList,
	putDirList
};

export default handleActions({
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
    }),
    [combineActions(...actionsMap(checkReducer))]: (state, action) => ({
		...state,
		check: checkReducer(state.check, action),
	}),
	[combineActions(...actionsMap(modifyReducer))]: (state, action) => ({
		...state,
		modify: modifyReducer(state.modify, action),
	}),
	[combineActions(...actionsMap(expurgateReducer))]: (state, action) => ({
		...state,
		expurgate: expurgateReducer(state.expurgate, action),
	}),
	[getFieldsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		fields: results
	})
}, {});
