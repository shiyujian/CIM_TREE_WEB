import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,base} from '_platform/api';


export const ModalVisible = createAction('人员Modal显示隐藏');
export const ExprugateVisible = createAction('人员删除Modal显示隐藏');
export const ModifyVisible = createAction('人员变更Modal显示隐藏');
export const setDeletePer = createAction('存储要删除的数据');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const postAllUsersId = createFetchAction(`${base}/workflowapp/api/instance/{{id}}/personflow/`, [], "POST");
export const postPersonList = createFetchAction(`${SERVICE_API}/personlist/`, [], "POST");
export const getOrgList = createFetchAction(`${SERVICE_API}/org-tree/?depth=1`);
export const getOrgReverse = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/?reverse=true`,[], "GET");
export const getOrgCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`,[], "GET");
export const deleteUserList = createFetchAction(`${USER_API}/users/{{pk}}/`, [], "DELETE");
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
};

export default handleActions({
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
}, {});
