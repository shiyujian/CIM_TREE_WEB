import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';


export const ModalVisible = createAction('组织Modal模态框显示隐藏');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);
export const getProjects = createFetchAction(`${USER_API}/project-tree/?depth=1`);
export const actions = {
	ModalVisible,
	getAllUsers,
	getProjects
};

export default handleActions({
	[ModalVisible]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});
