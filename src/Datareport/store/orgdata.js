import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,NODE_FILE_EXCHANGE_API} from '_platform/api';


export const ModalVisible = createAction('组织Modal模态框显示隐藏');
export const ModalVisibleCJ = createAction('参建单位Modal模态框显示隐藏');
export const ModalVisibleDel = createAction('删除组织机构Modal模态框显示隐藏');
export const ModalVisibleUpdate = createAction('变更组织机构Modal模态框显示隐藏');
export const setDeleteOrg = createAction('存储要删除的数据');
export const setUpdateOrg = createAction('存储要变更的数据');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const getProjects = createFetchAction(`${SERVICE_API}/project-tree/?depth=1`);
export const postOrgList = createFetchAction(`${SERVICE_API}/orgpostlist/`,[], "POST");
export const getOrgRoot = createFetchAction(`${SERVICE_API}/org-tree/?depth=1`,[], "GET");
export const getOrgReverse = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/?reverse=true`,[], "GET");
export const getUnit = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?depth=1`,[], "GET");
export const putProject = createFetchAction(`${SERVICE_API}/projects/code/{{code}}/`,[], "PUT");
export const putUnit = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`,[], "PUT");
export const getProject = createFetchAction(`${SERVICE_API}/projects/code/{{code}}/?all=true`,[], "GET");
export const getUnitAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[], "GET");
export const getOrgPk= createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`,[], "GET");
export const getOrgTree= createFetchAction(`${SERVICE_API}/org-tree/?depth=3`,[], "GET");
export const deleteOrgList= createFetchAction(`${SERVICE_API}/orgpostlist/`,[], "PUT"); 
export const putOrgList = createFetchAction(`${SERVICE_API}/orgpostlist/`, [], "PUT");
const getCanjian = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`);
const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');

export const actions = {
	ModalVisible,
	getAllUsers,
	getProjects,
	postOrgList,
	getOrgRoot,
	getUnit,
	getOrgReverse,
	putProject,
	putUnit,
	getProject,
	getUnitAc,
	getOrgPk,
	ModalVisibleCJ,
	getOrgTree,
	ModalVisibleDel,
	setDeleteOrg,
	deleteOrgList,
	ModalVisibleUpdate,
	setUpdateOrg,
	putOrgList,
	jsonToExcel,
	getCanjian
};

export default handleActions({
	[ModalVisible]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
	[getOrgRoot]: (state, {payload}) => ({
		...state,
		rootOrg:payload,
	}),
	[ModalVisibleCJ]: (state, {payload}) => ({
		...state,
		visibleCJ:payload,
	}),
	[setDeleteOrg]: (state, {payload}) => ({
		...state,
		deleteOrg:payload,
	}),
	[ModalVisibleDel]: (state, {payload}) => ({
		...state,
		visibleDel:payload,
	}),
	[ModalVisibleUpdate]: (state, {payload}) => ({
		...state,
		visibleUpdate:payload,
	}),
	[setUpdateOrg]: (state, {payload}) => ({
		...state,
		updateOrg:payload,
	})
	
}, {});
