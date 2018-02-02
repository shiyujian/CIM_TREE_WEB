import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, WORKFLOW_API} from '_platform/api';
import dirFactory from '_platform/store/higher-order/dir';
import fieldFactory from '_platform/store/service/field';
import booleanFactory from '_platform/store/higher-order/bool';
import documentFactory from '_platform/store/higher-order/doc';

const ID = 'material';
const dirReducer = dirFactory(ID);
const additionReducer = fieldFactory(ID, 'addition');
const documentReducer = documentFactory(ID);
// export const getdirTreeOK = createAction(`${ID}_获取文档结构树`);
// export const getdirTree = createFetchAction(`${SERVICE_API}/dir-tree/code/QH01/`, [getdirTreeOK]);
// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
export const getWorkflows1OK = createAction('获取机械设备流程的全部流程实例');
export const getWorkflows1 = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[getWorkflows1OK],'GET');
export const getWorkflows2OK = createAction('获取工程材料流程的全部流程实例');
export const getWorkflows2 = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[getWorkflows2OK],'GET');
export const getWorkflows3OK = createAction('获取苗木资料流程的全部流程实例');
export const getWorkflows3 = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[getWorkflows3OK],'GET');


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
export const actions = {
	// getdirTree,
    // getdirTreeOK,
    getWorkflowByIdOK,
    getWorkflowById,
    getWorkflows1OK,
    getWorkflows1,
    getWorkflows2OK,
    getWorkflows2,
    getWorkflows3OK,
    getWorkflows3,


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
    ...dirReducer,
    ...documentReducer,
    ...additionReducer,
    ...visibleReducer,
    ...followReducer
};

export default handleActions({
	[combineActions(...actionsMap(dirReducer))]: (state, action) => ({
        ...state,
        tree: dirReducer(state.tree, action)
    }),
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
    [getWorkflows1OK]: (state, {payload}) => ( {
        ...state,
        workflows1: payload
    }),
    [getWorkflows2OK]: (state, {payload}) => ( {
        ...state,
        workflows2: payload
    }),
    [getWorkflows3OK]: (state, {payload}) => ( {
        ...state,
        workflows3: payload
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
