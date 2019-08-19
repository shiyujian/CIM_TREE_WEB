import {combineActions, handleActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import taskReducer, {actions as taskActions} from './task';
import tasksReducer, {actions as tasksActions} from './tasks';
import queryReducer, {actions as queryActions} from './query';
import leaveReducer, {actions as leaveActions} from './leave';
import accountReducer, {actions as accountActions} from './account';
export default handleActions({
    [combineActions(...actionsMap(taskActions))]: (state, action) => ({
        ...state,
        task: taskReducer(state.task, action)
    }),
    [combineActions(...actionsMap(tasksActions))]: (state, action) => ({
        ...state,
        tasks: tasksReducer(state.tasks, action)
    }),
    [combineActions(...actionsMap(queryActions))]: (state, action) => ({
        ...state,
        query: queryReducer(state.query, action)
    }),
    [combineActions(...actionsMap(leaveActions))]: (state, action) => ({
        ...state,
        leave: leaveReducer(state.leave, action)
    }),
    [combineActions(...actionsMap(accountActions))]: (state, action) => ({
        ...state,
        account: accountReducer(state.account, action)
    })
}, {});
