import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';

import { SERVICE_API } from '_platform/api';
import fieldFactory from '_platform/store/service/field';
import documentFactory from '_platform/store/higher-order/doc';

const ID = 'datum_engineering';
const additionReducer = fieldFactory(ID, 'addition');
const documentReducer = documentFactory(ID);
export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
export const getdocument = createFetchAction(
    `${SERVICE_API}/doc_searcher/dir_code/{{code}}/`,
    [getdocumentOK]
);
export const deletedoc = createFetchAction(
    `${SERVICE_API}/documents/code/{{code}}/?this=true`,
    'DELETE'
);
export const putdocument = createFetchAction(
    `${SERVICE_API}/documents/code/{{code}}/`,
    'PUT'
);
export const SearchOK = createAction(`${ID}_高级搜索`);
export const Search = createFetchAction(`${SERVICE_API}/searcher/`, [SearchOK]);
const changeDocs = createAction(`${ID}_CHANGE_DOCS`);
const setcurrentcode = createAction(`${ID}_CURRENTDODE`);
const selectDocuments = createAction(`${ID}_SELECTDOUMENT`);
const updatevisible = createAction(`${ID}_updatevisible`);
const setoldfile = createAction(`${ID}setoldfile`);
export const setkeycode = createAction(`${ID}_setkeycode`);

export const getTreeOK = createAction(`${ID}_目录树`);
export const getTree = createFetchAction(
    `${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`,
    [getTreeOK]
);

export const searchEnginMessage = createAction(`${ID}获取工程文档搜索信息`);
export const searchEnginVisible = createAction(`${ID}是否搜索工程文档`);
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
    getTreeOK,
    getTree,
    searchEnginMessage,
    searchEnginVisible,
    ...documentReducer,
    ...additionReducer
};

export default handleActions(
    {
        // [combineActions(...actionsMap(engineeringActions))]: (state, action) => ({
        // 		...state,
        // 		engineering: engineeringReducer(state.engineering, action)
        // }),
        // [combineActions(...actionsMap(rediosActions))]: (state, action) => ({
        //     ...state,
        //     redios: rediosReducer(state.redios, action)
        // }),
        [getTreeOK]: (state, { payload: { children } }) => {
            return {
                ...state,
                tree: children
            };
        },
        [combineActions(...actionsMap(additionReducer))]: (state, action) => ({
            ...state,
            addition: additionReducer(state.addition, action)
        }),
        [getdocumentOK]: (state, { payload }) => ({
            ...state,
            Doc: payload.result
        }),
        [changeDocs]: (state, { payload }) => ({
            ...state,
            docs: payload
        }),
        [setcurrentcode]: (state, { payload }) => ({
            ...state,
            currentcode: payload
        }),
        [selectDocuments]: (state, { payload }) => ({
            ...state,
            selected: payload
        }),
        [SearchOK]: (state, { payload }) => ({
            ...state,
            Doc: payload
        }),
        [updatevisible]: (state, { payload }) => ({
            ...state,
            updatevisible: payload
        }),
        [setoldfile]: (state, { payload }) => ({
            ...state,
            oldfile: payload
        }),
        [setkeycode]: (state, { payload }) => ({
            ...state,
            keycode: payload
        }),
        [searchEnginMessage]: (state, { payload }) => ({
            ...state,
            searchengin: payload
        }),
        [searchEnginVisible]: (state, { payload }) => ({
            ...state,
            searchenginvisible: payload
        })
    },
    {}
);
