import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {FOREST_API} from '_platform/api';
export const ID = 'SYSTEM_PERSON1';

const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const setUpdate = createAction(`${ID}_LIST_UPDATE`);
const getSection = createAction(`${ID}_IS_SECTION`);
const getTreeModal = createAction(`${ID}设置树节点布尔值`);
const getTablePage = createAction(`${ID}table分页`);
const getTreeCode = createAction(`${ID}点击tree的节点code`);
const getIsBtn = createAction(`${ID}控制是否根据角色进行分页`);
const getIsActive = createAction(`${ID}控制是否根据角色是否禁用启用`);
const getOrgTreeSelect = createAction(`${ID}获取组织机构TreeSelect`);

// 设置上传的文件列表
export const postUploadFilesImg = createAction('xhy设置上传的文件列表');

// 设置上传的用户签名
export const postUploadAutograph = createAction('设置上传的用户签名');

// 控制只能上传一张用户照片签名
export const getAutographBtn = createAction('控制只能上传一张用户照片签名');

// 设置上传的身份证正面照片
export const postUploadFilesNum = createAction('设置上传的身份证照片');
// 设置上传的身份证反面照片
export const postUploadNegative = createAction('设置上传的身份证反面照片');

// 控制只能上传一张用户照片
export const getImgBtn = createAction('控制只能上传一张用户照片');
// 控制只能上传一张身份证正面照片
export const getImgNumBtn = createAction('控制只能上传一张身份证正面照片');

// 控制只能上传一张身份证反面照片
export const getImgNegative = createAction('控制只能上传一张身份证反面照片');

// 编辑时如果有照片就显示照片
export const getImgArr = createAction('编辑时如果有照片就显示照片');
// 黑名单控制开关
export const getSwitch = createAction('黑名单控制开关');

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
    getImgNumBtn,
    getSwitch,
    postUploadAutograph,
    getAutographBtn,
    postUploadNegative,
    getImgNegative,
    getOrgTreeSelect
};

export default handleActions({
    [combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
        ...state,
        sidebar: sidebarReducer(state.sidebar, action)
    }),
    [combineActions(...actionsMap(filterReducer))]: (state, action) => ({
        ...state,
        filter: filterReducer(state.filter, action)
    }),
    [combineActions(...actionsMap(additionReducer))]: (state, action) => ({
        ...state,
        addition: additionReducer(state.addition, action)
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
    [postUploadFilesImg]: (state, {payload}) => ({
        ...state,
        fileList: payload
    }),
    [getImgBtn]: (state, {payload}) => ({
        ...state,
        getImgBtns: payload
    }),
    [getImgArr]: (state, {payload}) => ({
        ...state,
        getImgArrs: payload
    }),
    [postUploadFilesNum]: (state, {payload}) => ({
        ...state,
        postUploadFilesNums: payload
    }),
    [getImgNumBtn]: (state, {payload}) => ({
        ...state,
        getImgNumBtns: payload
    }),
    [getSwitch]: (state, {payload}) => ({
        ...state,
        getSwitchBtn: payload
    }),
    [postUploadAutograph]: (state, {payload}) => ({
        ...state,
        postUploadAutographs: payload
    }),
    [getAutographBtn]: (state, {payload}) => ({
        ...state,
        getAutographBtns: payload
    }),
    [postUploadNegative]: (state, {payload}) => ({
        ...state,
        postUploadNegatives: payload
    }),
    [getImgNegative]: (state, {payload}) => ({
        ...state,
        getImgNegatives: payload
    }),
    [getOrgTreeSelect]: (state, {payload}) => ({
        ...state,
        orgTreeSelect: payload
    })
}, {});
