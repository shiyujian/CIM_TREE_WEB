import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';


export const ModalVisibleUnit = createAction('单位工程Modal显示隐藏');
export const actions = {
	ModalVisibleUnit
};

export default handleActions({
	[ModalVisibleUnit]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});
