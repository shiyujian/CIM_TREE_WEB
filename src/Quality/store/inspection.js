/**
 * Created by du on 2017/5/26.
 */
import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '_platform/api';
import workPackageFactory from '_platform/store/higher-order/wp';
import fieldFactory from '_platform/store/service/field';

export const ID = 'QUALITY_INSPECTION';

//获取树状图
export const getTreeOK = createAction('${ID}_获取组织结构树');
export const getTree = createFetchAction(`${SERVICE_API}/project-tree/`, [getTreeOK]);
export const setCurrentNode = createAction(`${ID}_设置当前的节点`);
export const setcurrentcode = createAction(`${ID}_设置类别code`);
export const setItemcode = createAction(`${ID}_设置分项code`);
export const getqictypelistOK = createAction('${ID}_获取工程类别');
export const getqictypelist = createFetchAction(`${SERVICE_API}/metalist/qictypelist/`, [getqictypelistOK]);
export const getDocumentedOK = createAction('${ID}_获取工程类别表单');
export const getDocumented = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getDocumentedOK]);
export const getCheckDocumentOK = createAction('${ID}_获取选中表单');
export const getCheckDocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [getCheckDocumentOK]);
const selectDocuments = createAction(`${ID}_SELECT_DOCUMENTS`);
const selectfiles = createAction(`${ID}_SELECT_SELECTFILES`);
export const postdocument = createFetchAction(`${SERVICE_API}/metalist/`, [], 'POST');
export const putdocument = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [], 'PUT');
export const pushdocument = createAction('${ID}_合并数组');
const filterReducer = fieldFactory(ID, 'filter');
const workPackageReducer = workPackageFactory(ID);

export const actions = {
    getTree,
    getTreeOK,
    setCurrentNode,
    getqictypelistOK,
    getqictypelist,
    getDocumentedOK,
    getDocumented,
    getCheckDocumentOK,
    getCheckDocument,
    selectDocuments,
    selectfiles,
    setcurrentcode,
    setItemcode,
    postdocument,
    putdocument,
    pushdocument,
    ...filterReducer,
    ...workPackageReducer
};

export default handleActions({
    [getTreeOK]: (state, {payload: {children}}) => ({
        ...state,
        tree: children
    }),
    [setcurrentcode]: (state, {payload}) => ({
        ...state,
        currentcode: {code: payload},
    }),
    [setItemcode]: (state, {payload}) => ({
        ...state,
        Itemcode: {code: payload},
    }),
    [setCurrentNode]: (state, {payload}) => ({
        ...state,
        currentNode: {code: payload},
    }),
    [getqictypelistOK]: (state, {payload: {metalist}}) => ({
        ...state,
        qictypelist: metalist,
    }),
    [getDocumentedOK]: (state, {payload: {metalist}}) => ({
        ...state,
        document: metalist,
    }),
    [getCheckDocumentOK]: (state, {payload: {metalist}}) => ({
        ...state,
        checkdocument: metalist,
    }),
    [selectDocuments]: (state, {payload}) => ({
        ...state,
        selectedDocs: payload,
    }),
    [selectfiles]: (state, {payload}) => ({
        ...state,
        selectfiles: payload,
    }),
    [pushdocument]: (state, {payload}) => ({
        ...state,
        issdoucment: state.checkdocument,
        checkdocument: state.checkdocument ? state.checkdocument.concat(payload) : payload,
    }),
    [combineActions(...actionsMap(filterReducer))]: (state, action) => ({
        ...state,
        filter: filterReducer(state.filter, action),
    }),
    [combineActions(...actionsMap(workPackageReducer))]: (state, action) => ({
        ...state,
        workPackage: workPackageReducer(state.workPackage, action),
    }),
}, {});
