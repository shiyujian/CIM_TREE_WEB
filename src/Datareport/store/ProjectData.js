import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,FILE_API} from '_platform/api';

const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
export const ModalVisibleProject = createAction('项目信息模态框显示隐藏');
export const actions = {
	ModalVisibleProject
};
export default handleActions({
	[ModalVisibleProject]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});







