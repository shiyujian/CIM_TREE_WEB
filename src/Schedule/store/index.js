import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import entryReducer, { actions as entryActions } from './entry';
import stageReducer, { actions as stageActions } from './stage';
import scheduleDisplayReducer, { actions as scheduleDisplayActions } from './ScheduleDisplay';
import scheduleReportReducer, { actions as scheduleReportActions } from './ScheduleReport';

export default handleActions(
    {
        [combineActions(...actionsMap(entryActions))]: (state = {}, action) => {
            return {
                ...state,
                entry: entryReducer(state.entry, action)
            };
        },
        [combineActions(...actionsMap(stageActions))]: (state = {}, action) => {
            return {
                ...state,
                stage: stageReducer(state.stage, action)
            };
        },
        [combineActions(...actionsMap(scheduleDisplayActions))]: (state = {}, action) => {
            return {
                ...state,
                scheduleDisplay: scheduleDisplayReducer(state.scheduleDisplay, action)
            };
        },
        [combineActions(...actionsMap(scheduleReportActions))]: (state = {}, action) => {
            return {
                ...state,
                scheduleReport: scheduleReportReducer(state.scheduleReport, action)
            };
        }
    },
    {}
);
