import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, WORKFLOW_API} from '_platform/api';
import fieldFactory from '_platform/store/service/field';
import booleanFactory from '_platform/store/higher-order/bool';
import documentFactory from '_platform/store/higher-order/doc';

const ID = 'material';
const additionReducer = fieldFactory(ID, 'addition');
const documentReducer = documentFactory(ID);
// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
export const getWorkflowsOK = createAction('获取机械设备流程的全部流程实例');
export const getWorkflows = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[getWorkflowsOK],'GET');


export const GeneralAddVisible = createAction(`${ID}机械设备新增显示和隐藏`);
export const ResourceAddVisible = createAction(`${ID}工程材料新增显示和隐藏`);
export const SeedingAddVisible = createAction(`${ID}苗木材料新增显示和隐藏`);

export const SearchGeneral = createAction(`${ID}机械设备是否重新获取流程`);
export const SearchResource= createAction(`${ID}工程材料是否重新获取流程`);
export const SearchSeeding = createAction(`${ID}苗木材料是否重新获取流程`);

export const setTabActive = createAction(`${ID}设置当前选中的tab`);
export const toggleModal = createAction(`${ID}Tab页对应的modal类型`);
export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
export const getdocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [getdocumentOK]);
export const deletedoc = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, 'DELETE');
export const putdocument =createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, 'PUT');
export const SearchOK = createAction(`${ID}_高级搜索`);
export const Search = createFetchAction(`${SERVICE_API}/searcher/`, [SearchOK]);
const visibleReducer = booleanFactory(ID, 'addition');
const followReducer = booleanFactory(ID, 'follow');
const changeDocs = createAction(`${ID}_CHANGE_DOCS`);
const setcurrentcode = createAction(`${ID}_CURRENTDODE`);
const selectDocuments = createAction(`${ID}_SELECTDOUMENT`);
const updatevisible = createAction(`${ID}_updatevisible`);
const setoldfile = createAction(`${ID}setoldfile`);
export const setkeycode =createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_目录树`);
export const getTree =createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`, [getTreeOK]);
export const actions = {
    GeneralAddVisible,
    ResourceAddVisible,
    SeedingAddVisible,

    SearchGeneral,
    SearchResource,
    SearchSeeding,

    getWorkflowByIdOK,
    getWorkflowById,
    getWorkflowsOK,
    getWorkflows,

    setTabActive,
    toggleModal,
    getdocumentOK,
    getdocument,
    changeDocs,
    setcurrentcode,
    putdocument,
    selectDocuments,
    deletedoc,
    SearchOK,
    Search,
    updatevisible,
    setoldfile,
	setkeycode,
    getTreeOK,
    getTree,
    ...documentReducer,
    ...additionReducer,
    ...visibleReducer,
    ...followReducer
};

export default handleActions({
    [SearchGeneral]: (state, {payload}) => ( {
        ...state,
        searchGeneral: payload
    }),
    [SearchResource]: (state, {payload}) => ( {
        ...state,
        searchResource: payload
    }),
    [SearchSeeding]: (state, {payload}) => ( {
        ...state,
        searchSeeding: payload
    }),
    [GeneralAddVisible]: (state, {payload}) => ( {
        ...state,
        generalAddVisible: payload
    }),
    [ResourceAddVisible]: (state, {payload}) => ( {
        ...state,
        resourceAddVisible: payload
    }),
    [SeedingAddVisible]: (state, {payload}) => ( {
        ...state,
        seedingAddVisible: payload
    }),
    [getTreeOK]: (state, {payload: {children}}) => {
        return {
            ...state,
            tree: children
        }
    },
    [combineActions(...actionsMap(additionReducer))]: (state, action) => ({
        ...state,
        addition: additionReducer(state.addition, action)
    }),
    [combineActions(...actionsMap(visibleReducer))]: (state, action) => ({
        ...state,
        additionVisible: visibleReducer(state.additionVisible, action)
    }),
    [combineActions(...actionsMap(followReducer))]: (state, action) => ({
        ...state,
        follow: followReducer(state.follow, action)
    }),
    [setTabActive]: (state, {payload}) => ( {
        ...state,
        tabValue: payload
    }),
    [toggleModal]: (state, {payload}) => ( {
        ...state,
        toggleData: payload
    }),
    [getdocumentOK]: (state, {payload}) => ({
        ...state,
        Doc: payload.result
    }),
    [changeDocs]: (state, {payload}) => ({
        ...state,
        docs: payload
    }),
    [setcurrentcode]: (state, {payload}) => ({
        ...state,
        currentcode: payload
    }),
    [selectDocuments]: (state, {payload}) => ({
        ...state,
        selected: payload
    }),
    [SearchOK]: (state, {payload}) => ({
        ...state,
        Doc: payload
    }),
    [updatevisible]: (state, {payload}) => ({
        ...state,
        updatevisible: payload
    }),
    [setoldfile]: (state, {payload}) => ({
        ...state,
        oldfile: payload
    }),
    [setkeycode]: (state, {payload}) => ({
	    ...state,
	    keycode: payload
    }),
}, {});
