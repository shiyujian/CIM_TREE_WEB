import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction'
import { SERVICE_API, WORKFLOW_API,FILE_API} from '_platform/api';
import fieldFactory from '_platform/store/service/field';
import booleanFactory from '_platform/store/higher-order/bool';
import documentFactory from '_platform/store/higher-order/doc';
// import engineeringReducer, {actions as engineeringActions} from './engineering';
// import rediosReducer, {actions as rediosActions} from './redios';

const ID = 'safety_educationRegisters';
const additionReducer = fieldFactory(ID, 'addition');
const documentReducer = documentFactory(ID);
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

//上传文件
export const getStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [])
export const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST')
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')
export const setkeycode =createAction(`${ID}_setkeycode`);

export const getTreeOK = createAction(`${ID}_目录树`);
export const getTree =createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`, [getTreeOK]);
export const actions = {
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
    getStaticFile,
    uploadStaticFile,
    deleteStaticFile,
    getTreeOK,
    getTree,

    ...documentReducer,
    ...additionReducer,
    ...visibleReducer,
    ...followReducer
};

export default handleActions({
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