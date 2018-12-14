import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';

import safetySystemReducer, {actions as safetySystemActions} from './safetySystem';
import riskFactorReducer, {actions as riskFactorActions} from './riskFactor';
import unbearableReducer, {actions as unbearableActions} from './unbearable';
import riskEvaluationReducer, {actions as riskEvaluationActions} from './riskEvaluation';
import safetyTrendReducer, {actions as safetyTrendActions} from './safetyTrend';
import hiddenDangerReducer, {actions as hiddenDangerActions} from './hiddenDanger';
import trendReducer, {actions as trendActions} from './trend';

export default handleActions({
    [combineActions(...actionsMap(safetySystemActions))]: (state = {}, action) => ({
        ...state,
        safetySystem: safetySystemReducer(state.safetySystem, action)
    }),
    [combineActions(...actionsMap(riskFactorActions))]: (state = {}, action) => ({
        ...state,
        riskFactor: riskFactorReducer(state.riskFactor, action)
    }),
    [combineActions(...actionsMap(unbearableActions))]: (state = {}, action) => ({
        ...state,
        unbearable: unbearableReducer(state.unbearable, action)
    }),
    [combineActions(...actionsMap(riskEvaluationActions))]: (state = {}, action) => ({
        ...state,
        riskEvaluation: riskEvaluationReducer(state.riskEvaluation, action)
    }),
    [combineActions(...actionsMap(safetyTrendActions))]: (state = {}, action) => ({
        ...state,
        safetyTrend: safetyTrendReducer(state.safetyTrend, action)
    }),
    [combineActions(...actionsMap(hiddenDangerActions))]: (state, action) => ({
        ...state,
        hiddenDanger: hiddenDangerReducer(state.hiddenDanger, action)
    }),
    [combineActions(...actionsMap(trendActions))]: (state, action) => ({
        ...state,
        trend: trendReducer(state.trend, action)
    })
}, {});
