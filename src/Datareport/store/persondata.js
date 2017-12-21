import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';


export const ModalVisible = createAction('人员Modal显示隐藏');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const postPersonList = createFetchAction(`${SERVICE_API}/personlist/`, [], "POST");
export const getOrgList = createFetchAction(`${SERVICE_API}/org-tree/?depth=1`);
export const actions = {
	ModalVisible,
	getAllUsers,
	postPersonList,
	getOrgList
};

export default handleActions({
	[ModalVisible]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});
