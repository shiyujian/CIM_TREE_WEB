import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';

export const ID = 'safetySystem';
export const AddVisible = createAction(`${ID}新增显示和隐藏`);

export const actions = {
	AddVisible
};
export default handleActions({
	[AddVisible]: (state, {payload}) => ( {
		...state,
		addVisible: payload
	}),
}, {});
