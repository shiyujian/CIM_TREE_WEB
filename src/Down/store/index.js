import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import modelDownReducer, {actions as modelDownActions} from './modelDown';


export default handleActions({
	[combineActions(...actionsMap(modelDownActions))]: (state = {}, action) => {
		return {
			...state,
			down: modelDownReducer(state.down, action),
		}
	},
}, {});