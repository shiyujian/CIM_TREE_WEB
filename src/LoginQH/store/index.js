import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import loginReducer, { actions as loginActions } from './login';

export default handleActions(
    {
        [combineActions(...actionsMap(loginActions))]: (state = {}, action) => ({
            ...state,
            login: loginReducer(state.login, action)
        })
    },
    {}
);
