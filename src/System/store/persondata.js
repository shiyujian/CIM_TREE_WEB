import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {
    SERVICE_API,
    USER_API,
    WORKFLOW_API,
    base,
    NODE_FILE_EXCHANGE_API
} from '_platform/api';

export const ModalVisible = createAction(`${2222} 人员Modal显示隐藏`);
export const ExprugateVisible = createAction('人员删除Modal显示隐藏');
export const ModifyVisible = createAction('人员变更Modal显示隐藏');
export const setDeletePer = createAction('人员存储要删除的数据');
export const setModifyPer = createAction('人员存储要变更的数据');
// export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const getAllUsers = createFetchAction(
    `http://10.215.160.45:6530/accounts/api/users/`,
    []
);
// export const postAllUsersId = createFetchAction(`${base}/workflowapp/api/instance/{{id}}/personflow/`, [], "POST");
export const postAllUsersId = createFetchAction(
    `http://10.215.160.45:6530/workflowapp/api/instance/{{id}}/personflow/`,
    [],
    'POST'
);
// export const postPersonList = createFetchAction(`${SERVICE_API}/personlist/`, [], "POST");
export const postPersonList = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/personlist/`,
    [],
    'POST'
);
// export const putPersonList = createFetchAction(`${SERVICE_API}/personlist/`, [], "PUT");
export const putPersonList = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/personlist/`,
    [],
    'PUT'
);

export const getOrgList = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/org-tree/?depth=7`
);
export const getOrgReverse = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/org-tree/code/{{code}}/?reverse=true`,
    [],
    'GET'
);
export const getOrgCode = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/org-tree/code/{{code}}/`,
    [],
    'GET'
);
export const deleteUserList = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/users/{{pk}}/`,
    [],
    'DELETE'
);
export const getCheckList = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/org-tree/code/{{code}}/`,
    [],
    'GET'
);
export const getOrgDetail = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/orgs/code/{{code}}/?all=true`,
    [],
    'GET'
);
// export const reverseFind = createFetchAction(`${USER_API}/person/userinfo/?person_ids={{pk}}`, [], "GET");
export const reverseFind = createFetchAction(
    `http://10.215.160.45:6530/accounts/api/person/userinfo/?person_ids={{pk}}`,
    [],
    'GET'
);
const jsonToExcel = createFetchAction(
    `${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,
    [],
    'POST'
);
const getOrgName = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/orgs/code/{{code}}/`,
    [],
    'GET'
);
// const PostPeople = createFetchAction(`${USER_API}/person-user/`,[],"POST")
const PostPeople = createFetchAction(
    `http://10.215.160.45:6530/accounts/api/person-user/`,
    [],
    'POST'
);
const PutPeople = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/persons/code/{{code}}/`,
    [],
    'PUT'
);
// 人员信息列表
// const getPeople = createFetchAction(`${SERVICE_API}/persons/code/{{code}}/?all=true`,[],"GET")
// const getPeople = createFetchAction(`${SERVICE_API}/persons/code/{{code}}/?all=true`,[],"GET")
const getPeople = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/persons/code/{{code}}/?all=true`,
    [],
    'GET'
);
// const putPersons = createFetchAction(`${USER_API}/users/{{pk}}/`,[],"PUT")
const putPersons = createFetchAction(
    `http://10.215.160.45:6530/accounts/api/users/{{pk}}/`,
    [],
    'PUT'
);
// const getPersonList = createFetchAction(`${SERVICE_API}/personlist/?pagesize={{pagesize}}&offset={{offset}}&all=true`,[],"GET")
const getPersonList = createFetchAction(
    `http://10.215.160.45:6530/service/construction/api/personlist/?pagesize={{pagesize}}&offset={{offset}}&all=true`,
    [],
    'GET'
);

const deletePerson = createFetchAction(
    `${SERVICE_API}/persons/code/{{code}}/?this=true`,
    [],
    'DELETE'
);
const is_fresh = createAction('确定是否刷新');
export const actions = {
    ModalVisible,
    getAllUsers,
    postPersonList,
    getOrgList,
    ExprugateVisible,
    ModifyVisible,
    postAllUsersId,
    getOrgReverse,
    getOrgCode,
    setDeletePer,
    deleteUserList,
    setModifyPer,
    putPersonList,
    jsonToExcel,
    getCheckList,
    getOrgName,
    PostPeople,
    PutPeople,
    getOrgDetail,
    getPeople,
    getPersonList,
    putPersons,
    reverseFind,
    is_fresh,
    deletePerson
};

export default handleActions(
    {
        [ModalVisible]: (state, { payload }) => ({
            ...state,
            visible: payload
        }),
        [ExprugateVisible]: (state, { payload }) => ({
            ...state,
            Exvisible: payload
        }),
        [ModifyVisible]: (state, { payload }) => ({
            ...state,
            Modvisible: payload
        }),
        [setDeletePer]: (state, { payload }) => ({
            ...state,
            deletePer: payload
        }),
        [setModifyPer]: (state, { payload }) => ({
            ...state,
            modifyPer: payload
        }),
        [is_fresh]: (state, { payload }) => ({
            ...state,
            is_fresh: payload
        })
    },
    {}
);
