import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';

export const ModalVisible = createAction('新增显示和隐藏');

export const actions = {
	
};
export default handleActions({
	[ModalVisible]: (state, {payload}) => ( {
		...state,
		visible: payload
	}),
}, {});
