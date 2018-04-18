import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import { SERVICE_API,USER_API,WORKFLOW_API,base, NODE_FILE_EXCHANGE_API,FOREST_API} from '_platform/api';


export const ModalVisible = createAction('人员Modal显示隐藏');
export const ExprugateVisible = createAction('人员删除Modal显示隐藏');
export const ModifyVisible = createAction('人员变更Modal显示隐藏');
export const setDeletePer = createAction('人员存储要删除的数据');
export const setModifyPer = createAction('人员存储要变更的数据');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const postAllUsersId = createFetchAction(`${base}/workflowapp/api/instance/{{id}}/personflow/`, [], "POST");
export const postPersonList = createFetchAction(`${SERVICE_API}/personlist/`, [], "POST");
export const putPersonList = createFetchAction(`${SERVICE_API}/personlist/`, [], "PUT");
export const getOrgList = createFetchAction(`${SERVICE_API}/org-tree/?depth=7`);
export const getOrgReverse = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`,[], "GET");
export const getOrgCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`,[], "GET");
export const deleteUserList = createFetchAction(`${USER_API}/users/{{pk}}/`, [], "DELETE");
export const getCheckList = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`, [], "GET");
export const getOrgDetail = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/?all=true`, [], "GET");
export const reverseFind = createFetchAction(`${USER_API}/person/userinfo/?person_ids={{pk}}`, [], "GET");
export const postName = createFetchAction(`${base}/accounts/api/judge-exist/`,[],"POST")

export const ID = 'SYSTEM_blacklist';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');
const getOrgName = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/`, [], "GET");
const PostPeople = createFetchAction(`${USER_API}/person-user/`,[],"POST")
const PutPeople = createFetchAction(`${USER_API}/users/{{id}}/`,[],"PUT")
// const getPeople = createFetchAction(`${SERVICE_API}/persons/code/{{code}}/?all=true`,[],"GET")

const getPeople = createFetchAction(`${USER_API}/users/code/{{code}}/?all=true`,[],"GET")

const putPersons = createFetchAction(`${USER_API}/users/{{code}}/`,[],"PUT")
// 判断人员是否已经存在
// const postName = createFetchAction(`${base}/accounts/api/judge-exist`,[],"POST")
// const getPersonList = createFetchAction(`${SERVICE_API}/personlist/?pagesize={{pagesize}}&offset={{offset}}&all=true`,[],"GET")
const getPersonList = createFetchAction(`${USER_API}/users/?pagesize={{pagesize}}&offset={{offset}}&all=true`,[],"GET")
const getPersonInfo = createFetchAction(`${USER_API}/users/?org_code={{org_code}}page={{page}}`,[],"GET")

const deletePerson = createFetchAction(`${SERVICE_API}/persons/code/{{code}}/?this=true`, [], "DELETE");
const is_fresh = createAction("确定是否刷新")

export const getListStore = createAction(`${ID}getListStore`);

// 苗圃信息
const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const getTags = createFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [getTagsOK]);
export const actions = {
	...sidebarReducer,
	...additionReducer,
	...filterReducer,
	getTagsOK,
	getTags,
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
	getPersonInfo,
	putPersons,
	postName,
	reverseFind,
	is_fresh,
	deletePerson,
	getListStore
};

export default handleActions({
	[getTagsOK]: (state, {payload}) => ({
		...state,
		tags: payload
	}),
	[ModalVisible]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
	[ExprugateVisible]: (state, {payload}) => ({
		...state,
		Exvisible:payload,
	}),
	[ModifyVisible]: (state, {payload}) => ({
		...state,
		Modvisible:payload,
	}),
	[setDeletePer]: (state, {payload}) => ({
		...state,
		deletePer:payload,
	}),
	[setModifyPer]: (state, {payload}) => ({
		...state,
		modifyPer:payload,
	}),
	[is_fresh]: (state, {payload}) => ({
		...state,
		is_fresh:payload,
	}),
	[getListStore]: (state, {payload}) => ({
		...state,
		listStore: payload
	}),
	[combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
		...state,
		sidebar: sidebarReducer(state.sidebar, action),
	}),
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.filter, action),
	}),
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
	}),
}, {});
