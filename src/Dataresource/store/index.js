import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { createFetchActionWithHeaders } from './fetchAction'
import { SERVICE_API, STATIC_UPLOAD_API } from '_platform/api';

const ID = 'dataresource';
export const setkeycode = createAction(`${ID}_setkeycode`);

export const getDataResourceDirOK = createAction(`${ID}获取文档目录`);
export const getDataResourceDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/`, [], 'GET');

//创建文档目录
export const postDataResourceDir = createFetchAction(`${SERVICE_API}/directories/`, [], 'POST');
//批量创建文档目录
export const postDataResourceDirlistOK = createAction(`${ID}_批量创建文档目录`);
export const postDataResourceDirlist = createFetchAction(`${SERVICE_API}/dirlist/`, [postDataResourceDirlistOK], 'POST');

//创建document对象
export const postDocument = createFetchAction(`${SERVICE_API}/documents/`, [], 'POST');
//获取document对象
export const getDocumentOK = createAction(`${ID}获取文档`);
export const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}//`, [], 'GET');
//删除document对象
export const delDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, [], 'DELETE');
//修改document对象
export const putDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [], 'PUT');

//获取文档目录树
export const getDirTreeOK = createAction(`${ID}_获取获取文档目录树列表`);
export const getDirTree = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=10`, [getDirTreeOK], 'GET');

//UNIT设置当前选中的单位子单位工程
export const setSelectItem = createAction(`${ID}_设置当前选中项目`);
//UNIT设置当前选中的单位子单位工程
export const setSelectType = createAction(`${ID}_设置当前选中的类型`);

//获取目录文档
export const getDirDoc = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`, [], 'GET');

const getStaticFile = createFetchAction(`${STATIC_UPLOAD_API}/api/user/meta-files/{{id}}`, []);
const uploadStaticFile = createFetchActionWithHeaders(`${STATIC_UPLOAD_API}/api/user/meta-files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${STATIC_UPLOAD_API}/api/user/meta-files/{{id}}`, [], 'DELETE');

export const actions = {
	setkeycode,
	getDataResourceDirOK,
	getDataResourceDir,
	getDocumentOK,
	getDocument,
	delDocument,
	putDocument,
	postDocument,
	getDirTreeOK,
	getDirTree,
	getDirDoc,
	postDataResourceDir,
	postDataResourceDirlistOK,
	postDataResourceDirlist,

	setSelectItem,
	setSelectType,

	getStaticFile,
	uploadStaticFile,
	deleteStaticFile,
};
export default handleActions({
	[setkeycode]: (state, { payload }) => {
		return {
			...state,
			keycode: payload
		}
	},
	[getDirTreeOK]: (state, { payload }) => ({
		...state,
		dirTreeList: payload.children || [],
	}),
	[getDataResourceDirOK]: (state, { payload }) => ({
		...state,
		dir: payload
	}),

	[getDocumentOK]: (state, { payload }) => ({
		...state,
		document: payload
	}),
	[postDataResourceDirlistOK]: (state, { payload }) => ({
		...state,
		result: payload.result
	}),
	[setSelectItem]: (state, { payload }) => ({
		...state,
		selectItem: payload
	}),
	[setSelectType]: (state, { payload }) => ({
		...state,
		selectType: payload
	}),
}, {});