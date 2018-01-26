import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, WORKFLOW_API,base} from '_platform/api';

const ID = 'OVERALL_FORMMANAGE';
//上传的文件列表
export const postUploadFilesAc = createAction(`${ID}上传的文件列表`);

export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
export const getdocument = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [getdocumentOK]);
// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
//获取选中树节点信息
export const getSelectedNodeInfo = createAction(`${ID}_获取选中树节点信息`);
const setcurrentcode = createAction(`${ID}_CURRENTDODE`);
export const setkeycode =createAction(`${ID}_setkeycode`);
export const actions = {
    getdocumentOK,
    getdocument,
    postUploadFilesAc,
    getWorkflowByIdOK,
    getWorkflowById,
    getSelectedNodeInfo,
    setcurrentcode,
    setkeycode
}

export default handleActions({
    [postUploadFilesAc]: (state, {payload}) => ( {
		...state,
		fileList: payload
    }),
    [getSelectedNodeInfo]: (state, {payload}) => {
        return{
            ...state,
            selectedNodeInfo: payload
        }
    },
    [getdocumentOK]: (state, {payload}) => ({
        ...state,
        Doc: payload.result
    }),
    [setcurrentcode]: (state, {payload}) => ({
        ...state,
        currentcode: payload
    }),
    [setkeycode]: (state, {payload}) => ({
	    ...state,
	    keycode: payload
    }),
},{});