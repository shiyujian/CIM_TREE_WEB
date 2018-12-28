import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import entryReducer, { actions as entryActions } from './entry';
import stageReducer, { actions as stageActions } from './stage';
import scheduleDisplayReducer, { actions as scheduleDisplayActions } from './scheduleDisplay';
import enterAnalyzeReducer, { actions as enterAnalyzeActions } from './enterAnalyze';
import scheduleAnalyzeReducer, { actions as scheduleAnalyzeActions } from './scheduleAnalyze';

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
        [combineActions(...actionsMap(enterAnalyzeActions))]: (state = {}, action) => {
            return {
                ...state,
                enterAnalyze: enterAnalyzeReducer(state.enterAnalyze, action)
            };
        },
        [combineActions(...actionsMap(scheduleAnalyzeActions))]: (state = {}, action) => {
            return {
                ...state,
                scheduleAnalyze: scheduleAnalyzeReducer(state.scheduleAnalyze, action)
            };
        },
        [combineActions(...actionsMap(scheduleDisplayActions))]: (state = {}, action) => {
            return {
                ...state,
                scheduleDisplay: scheduleDisplayReducer(state.scheduleDisplay, action)
            };
        }
    },
    {}
);
