import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import stageReducer, { actions as stageActions } from './stage';
import scheduleDisplayReducer, { actions as scheduleDisplayActions } from './scheduleDisplay';

export default handleActions(
    {
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
        }
    },
    {}
);
