import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import { FOREST_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

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
const getOrgTreeDataArr = createAction(`${ID}获取登录用户所在公司的所有部门的code数组`);

// 设置上传的文件列表
export const postUploadFilesImg = createAction(`${ID}xhy设置上传的文件列表`);

// 黑名单控制开关
export const getSwitch = createAction(`${ID}黑名单控制开关`);
// 编辑人员Visible
export const changeEditUserVisible = createAction(`${ID}编辑人员Visible`);

const getTags = forestFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [getTagsOK]);
const checkUsers = forestFetchAction(`${FOREST_API}/system/checksuser`, [], 'POST'); // 审核用户
const getSupplierList = forestFetchAction(`${FOREST_API}/system/suppliers?status=1`); // 获取供应商列表
const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases?status=1`); // 获取苗圃列表
const getRegionCodes = forestFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码

const getMobileCheck = createFetchAction(`http(s)://phonethird.market.alicloudapi.com/mobileCheck`); // 实名认证
const postUserForbidden = forestFetchAction(`${FOREST_API}/system/forbiddensuser`, [], 'POST');
const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    ...filterReducer,
    checkUsers,
    getTagsOK,
    getTags,
    getTreeModal,
    setUpdate,
    getSection,
    getTablePage,
    getTreeCode,
    getIsBtn,
    getIsActive,
    postUploadFilesImg,
    getSwitch,
    changeEditUserVisible,
    getOrgTreeSelect,
    getOrgTreeDataArr,
    getSupplierList,
    getNurseryList,
    getRegionCodes,
    getMobileCheck,
    postUserForbidden
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
    [getSwitch]: (state, {payload}) => ({
        ...state,
        getSwitchBtn: payload
    }),
    [changeEditUserVisible]: (state, {payload}) => ({
        ...state,
        editUserVisible: payload
    }),
    [getOrgTreeSelect]: (state, {payload}) => ({
        ...state,
        orgTreeSelect: payload
    }),
    [getOrgTreeDataArr]: (state, {payload}) => ({
        ...state,
        orgTreeDataArr: payload
    })
}, {});
