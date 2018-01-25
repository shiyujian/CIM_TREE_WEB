import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import showReducer, {actions as showActions} from './dgn';
import fillReducer, {actions as fillActions} from './fill';
import totalReducer, {actions as totalActions} from './total';
import perReducer, {actions as perActions} from './per';
import scheduleWorkflowReducer, {actions as scheduleWorkflowActions} from './scheduleWorkflow';
import schedulerReducer, {actions as schedulerActions} from './scheduler';
import dashboardReducer, {actions as dashboardActions} from './dashboard';
import entryReducer, {actions as entryActions} from './entry';
import stageReducer, {actions as stageActions} from './stage';
export default handleActions({
	[combineActions(...actionsMap(showActions))]: (state, action) => ({
			...state,
			show: showReducer(state.show, action)
	}),
	[combineActions(...actionsMap(fillActions))]: (state = {}, action) => {
		return {
			...state,
			fill: fillReducer(state.fill, action)
		};
	},
	[combineActions(...actionsMap(totalActions))]: (state = {}, action) => {
		return {
			...state,
			total: totalReducer(state.total, action)
		};
	},
	[combineActions(...actionsMap(perActions))]: (state = {}, action) => {
		return {
			...state,
			per: perReducer(state.per, action)
		};
	},
	[combineActions(...actionsMap(scheduleWorkflowActions))]: (state = {}, action) => {
		return {
			...state,
			scheduleWorkflow: perReducer(state.scheduleWorkflow, action)
		};
	},
	[combineActions(...actionsMap(schedulerActions))]: (state = {}, action) => {
		return {
			...state,
			scheduler: schedulerReducer(state.scheduler, action)
		};
	},
	[combineActions(...actionsMap(dashboardActions))]: (state = {}, action) => {
		return {
			...state,
			dashboard: dashboardReducer(state.dashboard, action)
		};
	},
	[combineActions(...actionsMap(entryActions))]: (state = {}, action) => {
		return {
			...state,
			entry: entryReducer(state.entry, action)
		};
	},
	[combineActions(...actionsMap(stageActions))]: (state = {}, action) => {
		return {
			...state,
			stage: entryReducer(state.stage, action)
		};
	}
}, {});
