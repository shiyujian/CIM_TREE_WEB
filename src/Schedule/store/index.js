import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import entryReducer, { actions as entryActions } from './entry';
import stageReducer, { actions as stageActions } from './stage';
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
        }
    },
    {}
);
