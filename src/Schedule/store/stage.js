import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, WORKFLOW_API, FOREST_API,base, USER_API, FILE_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './fetchAction'

const ID = 'STAGE';
//上传的文件列表
export const postUploadFilesAc = createAction(`${ID}上传的文件列表`);

export const getdocumentOK = createAction(`${ID}_搜索目录文档`);
// 流程详情
export const getWorkflowByIdOK = createAction('获取流程详情');
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
//获取选中树节点信息
export const getSelectedNodeInfo = createAction(`${ID}_获取选中树节点信息`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]);
export const getTreeList = createFetchAction(`${FOREST_API}/trees/list/`, []);
export const gettreetype = createFetchAction(`${FOREST_API}/tree/treetypes`, []);
export const getTaskSchedule = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`);
const getUserList = createFetchAction(`${USER_API}/users/?page=1&page_sise=5`,[]);

//上传文件
export const postScheduleFile = myFetch(`${FILE_API}/api/user/files/`,[],'POST');


export const actions = {
    getdocumentOK,
    postUploadFilesAc,
    getWorkflowByIdOK,
    getWorkflowById,
    getSelectedNodeInfo,
    getTree,
    getTreeOK,
    getTreeList,
    gettreetype,
    getTaskSchedule,
    getUserList,
    postScheduleFile
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
    [getTreeOK]: (state, {payload}) => {
		return {
			...state,
			treeLists: [payload]
		}
    },
},{});