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
export const getWorkflowsOK = createAction('获取某类流程的全部流程实例');
export const getWorkflows = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[getWorkflowsOK],'GET');


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
    [getWorkflowsOK]: (state, {payload}) => ( {
        ...state,
        workflows: payload
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
