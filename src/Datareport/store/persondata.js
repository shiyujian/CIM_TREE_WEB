import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';


export const ModalVisible = createAction('人员Modal显示隐藏');
export const actions = {
	ModalVisible
};

export default handleActions({
	[ModalVisible]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});
