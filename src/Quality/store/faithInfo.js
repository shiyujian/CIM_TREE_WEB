import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import {createFetchActionWithHeaders} from './fetchAction'
import { FOREST_API} from '_platform/api';

export const changeModal1 = createAction("改变Modal的显示隐藏");

export const actions = {
	changeModal1,
}
export default handleActions({
	[changeModal1]: (state, {payload}) => ({
		...state,
		visibleModal: payload
	}),
}, {});
