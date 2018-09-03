import { createAction, handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import fillReducer, { actions as fillActions } from './fill';
import totalReducer, { actions as totalActions } from './total';
import perReducer, { actions as perActions } from './per';
import entryReducer, { actions as entryActions } from './entry';
import stageReducer, { actions as stageActions } from './stage';
export default handleActions(
    {
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
    },
    {}
);
