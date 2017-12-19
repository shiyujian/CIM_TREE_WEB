import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API, SERVICE_API} from '_platform/api';

export const ID = 'ORGANIZATIONSTRUCTURE';

export const setUploadFile = createAction('${ID}_获取上传的文件数据');

//获取树
export const getProjectTreeOK = createAction('${ID}_获取项目树');
export const getProjectTree =
	createFetchAction(`${SERVICE_API}/project-tree/?depth=3`,[getProjectTreeOK]);

export const getProjects =
	createFetchAction(`${SERVICE_API}/projects/code/{{code}}/`, [], 'GET');
export const setProjects =
	createFetchAction(`${SERVICE_API}/projects/code/{{code}}/`, [], 'PUT');

export const getWorkpackages =
	createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');


//创建document对象
export const postDocument =
	createFetchAction(`${SERVICE_API}/documents/`, [], 'POST');
//获取document对象
export const getDocument =
	createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?all=true`, [], 'GET');
//修改document对象
export const setDocument =
	createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [], 'PATCH');
//删除document对象
export const delDocument =
	createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, [], 'DELETE'); 

export const actions = {
    setUploadFile,
	 getProjectTreeOK,
    getProjectTree,
    getProjects,
	setProjects,
	getWorkpackages,
	postDocument,
	getDocument,
	setDocument,
	delDocument 
};

export default handleActions({
    [setUploadFile]: (state, {payload}) => ({
		...state,
		attachment: payload
	}),
	[getProjectTreeOK]: (state, {payload: {children}}) => ({
		...state,
		tree: children
	}), 
}, {});