import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
// import dirFactory from '_platform/store/higher-order/dir';
import booleanFactory from '_platform/store/higher-order/bool';
import documentFactory from '_platform/store/higher-order/doc';
import {SERVICE_API,base,WORKFLOW_API,WORKFLOW_CODE,FOREST_API} from '_platform/api'
const code = WORKFLOW_CODE.安全隐患上报流程;
const ID = 'RISKFACTOR';
// const dirReducer = dirFactory(ID);
const documentReducer = documentFactory(ID);

const setIsAddPlan =  createAction (`${ID}文明施工-设置新增状态`);
//export const setCurrentAcc =  createAction ('事故登记-设置当前事故');
const setAddModalVisiblePlan = createAction(`${ID}安全隐患-设置添加内容操作窗可视性`);

export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
export const getdocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [getdocumentOK]);
export const deletedoc = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, 'DELETE');
export const putdocument =createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, 'PUT');
export const SearchOK = createAction(`${ID}_高级搜索`);
export const Search = createFetchAction(`${SERVICE_API}/searcher/`, [SearchOK]);
const followReducer = booleanFactory(ID, 'follow');
const changeDocs = createAction(`${ID}_CHANGE_DOCS`);
const setcurrentcode = createAction(`${ID}_CURRENTDODE`);
const selectDocuments = createAction(`${ID}_SELECTDOUMENT`);
const updatevisible = createAction(`${ID}_updatevisible`);
const setoldfile = createAction(`${ID}setoldfile`);
const setkeycode =createAction(`${ID}_setkeycode`);

export const getTreeOK = createAction(`${ID}_目录树`);
export const getTree =createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`, [getTreeOK]);

//获取所有安全隐
export const getRisk = createFetchAction(`${FOREST_API}/tree/patrolevents?eventtype=2&status={{status}}`);
//上传文件
// const getPotentialRiskByCode = createFetchAction(`${base}/main/api/potential-risk/?unit_code={{code}}&status={{status}}&keyword={{keyword}}`,[],'GET');
export const getWrokflowByID = createFetchAction(`${WORKFLOW_API}/instance?code={{code}}&subject_id={{id}}&detail=true`);
export const actions = {
    // getPotentialRiskByCode,
    getWrokflowByID,
    getRisk,

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
    // ...dirReducer,
    ...documentReducer,
    ...followReducer
};

export default handleActions({
    // [combineActions(...actionsMap(dirReducer))]: (state, action) => ({
    //     ...state,
    //     tree: dirReducer(state.tree, action)
    // }),
    [getTreeOK]: (state, {payload: {children}}) => {
        return {
            ...state,
            tree: children
        }
    },
    [combineActions(...actionsMap(documentReducer))]: (state, action) => ({
        ...state,
        document: documentReducer(state.follow, action)
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

    [setIsAddPlan]:(state, {payload}) => {
        return {
            ...state,
            isAddPlan: payload
        }
    },
    [setAddModalVisiblePlan]:(state, {payload}) => {
        return {
            ...state,
            AddModalVisiblePlan:payload.AddModalVisiblePlan
        }
    }
}, {});

