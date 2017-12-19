import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API, WORKFLOW_API,UPLOADFILE_API,NODE_FILE_EXCHANGE_API,FILE_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './fetchAction'

export const ID = 'QUALITY_CELLs';
export const getDetailOK = createAction('${ID}_获取详情');
export const getDetail = createFetchAction(`${WORKFLOW_API}/instance/{{cell_id}}/`,[getDetailOK]);
export const gettemplatedocOK = createAction('${ID}_搜索模板URL');
export const gettemplatedoc = createFetchAction(`${SERVICE_API}/metalist/{{code}}/`, [gettemplatedocOK]);
export const postdocsOK = createAction('${ID}_获得DOCS');
export const postdocs = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/render/`, [],'POST',[postdocsOK]);
export const getUnitTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=4`, []);
export const getUnitTreeByPk = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/?root=false&depth=4`, []);
export const getUnitTreeReverseByPk = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/?root=false&reverse=true`, []);
export const getUnitTreeByPk1 = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/?root=true&depth=3`, []);
export const postJianYanPi =  createFetchAction(`${SERVICE_API}/workpackages/`, [],'POST');
export const putJianYanPi =  createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`, [],'PUT');
export const codeSearch =  createFetchAction(`${SERVICE_API}/searcher/?obj_type={{type}}&keyword={{code}}`,
 [],'GET');
export const postFile = myFetch(`${FILE_API}/api/user/files/`,[],'POST');
export const getTianbaoFromMobile = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&executor={{userid}}&code=TEMPLATE_023&pagination=true&page_size=15`,
[],'GET');
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
export const getJYP =  createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`, [],'GET');
//获取施工包信息
export const getWorkPackageDetail = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?all=true`);
//将分部的state存在store中
export const saveFenbuState = createAction('保存分部验收页面的state');
export const saveDanweiState = createAction('保存单位验收页面的state');
export const saveFebBus = createAction('保存单位验收页面的fenbus');
export const createWorkflow = createFetchAction(`${WORKFLOW_API}/instance/`, [], 'POST')
export const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [])
export const logWorkflowEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [], 'POST');
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
export const getUserByUname = createFetchAction(`${USER_API}/users/?username={{uname}}`);
export const getAllUsers = createFetchAction(`${USER_API}/users/`);

//获取组织机构和根据组织机构获取人员
/*export const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/`, [])*/
export const fetchUsersByOrgCode = createFetchAction(`${USER_API}/users/?org_code={{org_code}}`, [])

export const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/?depth=4`);
export const getOrgTreeByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`);
export const getUserById = createFetchAction(`${USER_API}/users/{{pk}}/`)
//判断用户权限
export const fetchUserDetail = createFetchAction(`${USER_API}/users/{{pk}}/`, [])
export const fetchRootOrg = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/?reverse=true`, [])
export const postDOC = createFetchAction(`${SERVICE_API}/documents/`,[],'POST');
export const delJYP = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?this=true`,[],'DELETE');
export const exchangeWordFile = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/render`, [], 'POST')
//删除静态文件
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')
//废止流程
const deleteWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/`, [], 'DELETE')
export const actions = {
    postDOC,
    getDetailOK,
    getDetail,
    gettemplatedocOK,
    gettemplatedoc,
    postdocsOK,
    postdocs,
    getUnitTree,
    getUnitTreeByPk,
    postJianYanPi,
    putJianYanPi,
    codeSearch,
    getUnitTreeReverseByPk,
    postFile,
    getWorkPackageDetail,
    getTianbaoFromMobile,
    getWorkflowById,
    getJYP,
    saveFenbuState,
    saveDanweiState,
    getUserByUname,
    getAllUsers,
    createWorkflow,
    logWorkflowEvent,
    updateWpData,
    getOrgTree,
    fetchUsersByOrgCode,
    saveFebBus,
    getUserById,
    getWorkflow,
    fetchRootOrg,
    fetchUserDetail,
    delJYP,
    exchangeWordFile,
    getUnitTreeByPk1,
    deleteStaticFile,
    deleteWorkflow,
    getOrgTreeByCode
};

export default handleActions({
    [getDetailOK]: (state, { payload }) => ({
        ...state,
        detail: payload
    }),
    [gettemplatedocOK]: (state, { payload }) => ({
        ...state,
        document: payload
    }),
    [postdocsOK]: (state, { payload }) => ({
        ...state,
        docs: payload
    }),
    [saveDanweiState]: (state, { payload }) => {
        console.log(payload);
        return {
            ...state,
            danweistate: payload
        }
    },
    [saveFenbuState]: (state, { payload }) => {
        console.log(payload);
        return {
            ...state,
            fenbuState: payload
        }
    },
    [saveFebBus]: (state, { payload }) => {
        console.log(payload);
        return {
            ...state,
            fenbus: payload
        }
    }
}, {});
