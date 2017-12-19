import {handleActions, combineActions} from 'redux-actions';
import loginReducer, {loginOK, login} from './login';

export default handleActions({
	[combineActions(loginOK, login)]: (state = {}, action) => {
		return {
			...state,
			login: loginReducer(state.login, action)
		}
	}
}, {});