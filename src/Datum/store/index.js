import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import { SERVICE_API, FOREST_API } from '_platform/api';
import fieldFactory from '_platform/store/service/field';
import documentFactory from '_platform/store/higher-order/doc';
import engineeringReducer, {
    actions as engineeringActions
} from './engineering';

import rediosReducer, { actions as rediosActions } from './redios';
import { createFetchActionWithHeaders as myFetch } from './fetchAction';

const ID = 'datum_datum';
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
const selectTableRowKeys = createAction(`${ID}_TableRowKeys`);
const updatevisible = createAction(`${ID}_updatevisible`);
const setoldfile = createAction(`${ID}setoldfile`);
export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_目录树`);
export const getTree = createFetchAction(
    `${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`,
    [getTreeOK]
);

export const searchVideoMessage = createAction(`${ID}获取视频资料搜索信息`);
export const searchVideoVisible = createAction(`${ID}是否搜索视频资料`);
export const postForsetVideo = myFetch(
    `${FOREST_API}/UploadHandler.ashx?filetype=video`,
    [],
    'POST'
);
export const getForsetVideo = forestFetchAction(
    `${FOREST_API}/tree/videos`,
    [],
    'GET'
);
export const reportForsetVideo = forestFetchAction(
    `${FOREST_API}/tree/video`,
    [],
    'POST'
);
export const updateForsetVideo = forestFetchAction(
    `${FOREST_API}/tree/video`,
    [],
    'PUT'
);
export const deleteForsetVideo = forestFetchAction(
    `${FOREST_API}/tree/video/{{ID}}`,
    [],
    'DELETE'
);
export const actions = {
    getdocumentOK,
    getdocument,
    changeDocs,
    setcurrentcode,
    putdocument,
    selectDocuments,
    selectTableRowKeys,
    deletedoc,
    SearchOK,
    Search,
    updatevisible,
    setoldfile,
    setkeycode,
    getTreeOK,
    getTree,
    searchVideoMessage,
    searchVideoVisible,
    postForsetVideo,
    getForsetVideo,
    reportForsetVideo,
    updateForsetVideo,
    deleteForsetVideo,
    ...documentReducer,
    ...additionReducer
};

export default handleActions(
    {
        [getTreeOK]: (state, { payload: { children } }) => {
            return {
                ...state,
                tree: children
            };
        },
        [combineActions(...actionsMap(engineeringActions))]: (
            state,
            action
        ) => ({
            ...state,
            engineering: engineeringReducer(state.engineering, action)
        }),
        [combineActions(...actionsMap(rediosActions))]: (state, action) => ({
            ...state,
            redios: rediosReducer(state.redios, action)
        }),
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
        [selectTableRowKeys]: (state, { payload }) => ({
            ...state,
            selectedRowKeys: payload
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
        [searchVideoMessage]: (state, { payload }) => ({
            ...state,
            searchvideo: payload
        }),
        [searchVideoVisible]: (state, { payload }) => ({
            ...state,
            searchvideovisible: payload
        })
    },
    {}
);
