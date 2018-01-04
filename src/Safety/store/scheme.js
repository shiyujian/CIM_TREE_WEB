import { handleActions, combineActions, createAction } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { actionsMap } from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import { CODE_API } from '_platform/api';
import { SERVICE_API } from '_platform/api';

const ID = 'SCHEME';

const setUploadFile = createAction('${ID}_获取上传的文件数据');


//获取树
export const getTreeOK = createAction('${ID}_获取项目结构树');             
export const getTree =
	createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, [getTreeOK]); 

const getProjects =
	createFetchAction(`${SERVICE_API}/projects/code/{{code}}/`, [], 'GET');

const setProjects =
	createFetchAction(`${SERVICE_API}/projects/code/{{code}}/`, [], 'PUT');

const getWorkpackages =
	createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`, [], 'GET');

const putToWorkpackage = 
		createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}`,[],'PUT'); 
//创建document对象
const postDocument =
	createFetchAction(`${SERVICE_API}/documents/`, [], 'POST');
//获取document对象
const getDocument =
	createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?all=true`, [], 'GET');
//修改document对象
export const setDocument =
	createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [], 'PATCH');
//删除document对象
const delDocument =
	createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, [], 'DELETE');
//文档目录树相关
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/`,[],'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');

const getDocumentByCode = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`,[],'GET');
const getDocumentByContent = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/?doc_name={{name}}`,[],'GET');
//获取施工单位
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');

// 获取分部分项
export const getPortions = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?depth=3`, []);

export const actions = {
	setUploadFile,
	getTreeOK,
	getTree,
	getProjects,
	setProjects,
	getWorkpackages,
	postDocument,
	getDocument,
	setDocument,
	delDocument,
	getScheduleDir,
	postScheduleDir,
	getDocumentByCode,
	getDocumentByContent,
	getWorkpackagesByCode,
	getPortions,
};

export default handleActions({
	[setUploadFile]: (state, { payload }) => ({
		...state,
		attachment: payload
	}),
	[getTreeOK]: (state, { payload: { children } }) => ({
		...state,
		tree: children   //getTreeOK 在store 的tree 中  更新 tree ，要获取store 内容 直接 this.props 指向 
		                 //子组件用这个方法 可以 想 父组件  传值 。  
	}),
}, {});
