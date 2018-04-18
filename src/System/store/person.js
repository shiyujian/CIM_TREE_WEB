import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {FOREST_API} from '_platform/api';
export const ID = 'SYSTEM_PERSON';


const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const setUpdate = createAction(`${ID}_LIST_UPDATE`);
const getSection = createAction(`${ID}_IS_SECTION`);
const getTreeModal = createAction(`${ID}设置树节点布尔值`);
const getTablePage = createAction(`${ID}table分页`);
const getTreeCode = createAction(`${ID}点击tree的节点code`);
const getIsBtn = createAction(`${ID}控制是否根据角色进行分页`);
const getIsActive = createAction(`${ID}控制是否根据角色是否禁用启用`);

//设置上传的文件列表
export const postUploadFilesImg = createAction('xhy设置上传的文件列表');
//设置上传的身份证照片
export const postUploadFilesNum = createAction('设置上传的身份证照片');
//控制只能上传一张用户照片
export const getImgBtn= createAction('控制只能上传一张用户照片');
//控制只能上传一张身份证照片
export const getImgNumBtn= createAction('控制只能上传一张身份证照片');
//编辑时如果有照片就显示照片
export const getImgArr= createAction('编辑时如果有照片就显示照片');

const getTags = createFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [getTagsOK]);


const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

export const getListStore = createAction(`${ID}getListStore`);

export const actions = {
	...sidebarReducer,
	...additionReducer,
	...filterReducer,
	getTagsOK,
	getTags,
	getTreeModal,
	setUpdate,
	getSection,
	getListStore,
	getTablePage,
	getTreeCode,
	getIsBtn,
	getIsActive,
	postUploadFilesImg,
	getImgBtn,
	getImgArr,
	postUploadFilesNum,
	getImgNumBtn
};

export default handleActions({
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.filter, action),
	}),
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
	[getTagsOK]: (state, {payload}) => ({
		...state,
		tags: payload
	}),
	[setUpdate]: (state, {payload}) => ({
		...state,
		isUpdate: payload
	}),
	[getSection]: (state, {payload}) => ({
		...state,
		isSection: payload
	}),
	[getTreeModal]: (state, {payload}) => ({
		...state,
		getTreeModals: payload
	}),
	[getListStore]: (state, {payload}) => ({
		...state,
		listStore: payload
	}),
	[getTablePage]: (state, {payload}) => ({
		...state,
		getTablePages: payload
	}),
	[getTreeCode]: (state, {payload}) => ({
		...state,
		getTreeCodes: payload
	}),
	[getIsBtn]: (state, {payload}) => ({
		...state,
		getIsBtns: payload
	}),
	[getIsActive]: (state, {payload}) => ({
		...state,
		getIsActives: payload
	}),
	[postUploadFilesImg]: (state, {payload}) => ( {
		...state,
		fileList: payload
	}),
	[getImgBtn]: (state, {payload}) => ( {
		...state,
		getImgBtns: payload
	}),
	[getImgArr]: (state, {payload}) => ( {
		...state,
		getImgArrs: payload
	}),
	[postUploadFilesNum]: (state, {payload}) => ( {
		...state,
		postUploadFilesNums: payload
	}),
	[getImgNumBtn]: (state, {payload}) => ( {
		...state,
		getImgNumBtns: payload
	}),
}, {});
