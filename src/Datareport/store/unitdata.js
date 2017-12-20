import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,FILE_API} from '_platform/api';

const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
export const ModalVisibleUnit = createAction('单位工程Modal显示隐藏');
export const getAllUsers = createFetchAction(`${USER_API}/users/`,[]);

export const actions = {
	ModalVisibleUnit,
	getAllUsers
};

export default handleActions({
	[ModalVisibleUnit]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});
