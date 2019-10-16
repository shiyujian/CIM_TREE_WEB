import {handleActions, combineActions, createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {
    SYSTEM_API,
    TREE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'SYSTEM_PERSON1';

const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const getTablePage = createAction(`${ID}table分页`);
const getIsBtn = createAction(`${ID}控制是否根据角色进行分页`);
const getOrgTreeDataArr = createAction(`${ID}获取登录用户所在公司的所有部门的code数组`);
const getCompanyOrgTree = createAction(`${ID}获取登录用户所在公司组织机构信息`);

// 设置上传的文件列表
export const postUploadFilesImg = createAction(`${ID}xhy设置上传的文件列表`);

const getTags = forestFetchAction(`${TREE_API}/nurseryconfigs`, [getTagsOK]);
const checkUsers = forestFetchAction(`${SYSTEM_API}/checkuser`, [], 'POST'); // 审核用户
const getSupplierList = forestFetchAction(`${SYSTEM_API}/suppliers?status=1`); // 获取供应商列表
const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases?status=1`); // 获取苗圃列表
const getRegionCodes = forestFetchAction(`${SYSTEM_API}/regioncodes`); // 获取行政区划编码

const getMobileCheck = createFetchAction(`http(s)://phonethird.market.alicloudapi.com/mobileCheck`); // 实名认证
const postUserForbidden = forestFetchAction(`${SYSTEM_API}/forbiddensuser`, [], 'POST');
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
    getTablePage,
    getIsBtn,
    postUploadFilesImg,
    getOrgTreeDataArr,
    getCompanyOrgTree,
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
    [getTablePage]: (state, {payload}) => ({
        ...state,
        getTablePages: payload
    }),
    [getIsBtn]: (state, {payload}) => ({
        ...state,
        getIsBtns: payload
    }),
    [postUploadFilesImg]: (state, {payload}) => ({
        ...state,
        fileList: payload
    }),
    [getOrgTreeDataArr]: (state, {payload}) => ({
        ...state,
        orgTreeDataArr: payload
    }),
    [getCompanyOrgTree]: (state, {payload}) => ({
        ...state,
        companyOrgTree: payload
    })
}, {});
