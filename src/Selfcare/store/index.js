import {combineActions, handleActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import taskReducer, {actions as taskActions}from './task';
import tasksReducer, {actions as tasksActions} from './tasks';
import queryReducer, {actions as queryActions} from './query';
export default handleActions({
	[combineActions(...actionsMap(taskActions))]: (state, action) => ({
		...state,
		task: taskReducer(state.task, action),
	}),
	[combineActions(...actionsMap(tasksActions))]: (state, action) => ({
		...state,
		tasks: tasksReducer(state.tasks, action),
	}),
	[combineActions(...actionsMap(queryActions))]: (state, action) => ({
		...state,
		query: queryReducer(state.query, action),
	}),
}, {});
