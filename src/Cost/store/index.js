import { handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import costComparisonReducer, {actions as costComparisonActions} from './costComparison';
import costEstimateReducer, {actions as costEstimateActions} from './costEstimate';
import costScheduleReducer, {actions as costScheduleActions} from './costSchedule';
import dataMaintenanceReducer, {actions as dataMaintenanceActions} from './dataMaintenance';
import infoShowReducer, {actions as infoShowActions} from './infoShow';
import workEstimateReducer, {actions as workEstimateActions} from './workEstimate';

export default handleActions({
	[combineActions(...actionsMap(costComparisonActions))]: (state={}, action) => {
		return {...state, costComparison: costComparisonReducer(state.costComparison, action)};
	},
	[combineActions(...actionsMap(costEstimateActions))]: (state={}, action) => {
		return {...state, costEstimate: costEstimateReducer(state.costEstimate, action)};
	},
	[combineActions(...actionsMap(costScheduleActions))]: (state={}, action) => {
		return {...state, costSchedule: costScheduleReducer(state.costSchedule, action)};
	},
	[combineActions(...actionsMap(dataMaintenanceActions))]: (state={}, action) => {
		return {...state, dataMaintenance: dataMaintenanceReducer(state.dataMaintenance, action)};
	},
	[combineActions(...actionsMap(infoShowActions))]: (state={}, action) => {
		return {...state, infoShow: infoShowReducer(state.infoShow, action)};
	},
	[combineActions(...actionsMap(workEstimateActions))]: (state={}, action) => {
		return {...state, workEstimate: workEstimateReducer(state.workEstimate, action)};
	},
}, {});