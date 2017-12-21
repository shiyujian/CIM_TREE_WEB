import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';


export const ModalVisible = createAction('组织Modal模态框显示隐藏');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const getProjects = createFetchAction(`${SERVICE_API}/project-tree/?depth=1`);
export const postOrgList = createFetchAction(`${SERVICE_API}/orgpostlist/`,[], "POST");
export const getOrgRoot = createFetchAction(`${SERVICE_API}/org-tree/?depth=1`,[], "GET");
export const actions = {
	ModalVisible,
	getAllUsers,
	getProjects,
	postOrgList,
	getOrgRoot
};

export default handleActions({
	[ModalVisible]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
	[getOrgRoot]: (state, {payload}) => ({
		...state,
		rootOrg:payload,
	})
}, {});
