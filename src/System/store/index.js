import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import blacklistReducer, { actions as blacklistActions } from './blacklist';
import personReducer, { actions as personActions } from './person';
import orgReducer, { actions as orgActions } from './org';
import permissionReducer, { actions as permissionActions } from './permission';
import roleReducer, { actions as roleActions } from './role';

export default handleActions(
    {
        [combineActions(...actionsMap(roleActions))]: (state = {}, action) => ({
            ...state,
            role: roleReducer(state.role, action)
        }),
        [combineActions(...actionsMap(permissionActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            permission: permissionReducer(state.permission, action)
        }),
        [combineActions(...actionsMap(personActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            person: personReducer(state.person, action)
        }),
        [combineActions(...actionsMap(orgActions))]: (state = {}, action) => ({
            ...state,
            org: orgReducer(state.org, action)
        }),
        // 黑名单
        [combineActions(...actionsMap(blacklistActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            blacklist: blacklistReducer(state.blacklist, action)
        })

    },
    {}
);
