import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import standardReducer, {actions as standardActions} from './standard';
import dangerReducer, {actions as dangerActions} from './danger';
import defectsReducer, {actions as defectsActions} from './defects';
import treeManageRducer, {actions as treeManageActions} from './treeManage';
import safetySystemReducer, {actions as safetySystemActions} from './safetySystem';
import engineeringImageReducer, {actions as engineeringImageActions} from './engineeringImage';
import formmanageReducer, {actions as formmanageActions} from './formmanage';
import educationRegisterReducer, {actions as educationRegisterActions} from './educationRegister';
import unbearableReducer, {actions as unbearableActions} from './unbearable';
import hiddenDangerReducer, {actions as hiddenDangerActions} from './hiddenDanger';
import riskFactorReducer, {actions as riskFactorActions} from './riskFactor';
import riskEvaluationReducer, {actions as riskEvaluationActions} from './riskEvaluation';
import proDocReducer, {actions as proDocActions} from './proDoc';
import nurseryManagementRducer, {actions as nurseryManagementActions} from './nurseryManagement';
import auxiliaryAcceptanceRducer, {actions as auxiliaryAcceptanceActions} from './auxiliaryAcceptance';

export default handleActions({
    [combineActions(...actionsMap(standardActions))]: (state = {}, action) => ({
        ...state,
        standard: standardReducer(state.standard, action)
    }),
    [combineActions(...actionsMap(dangerActions))]: (state = {}, action) => ({
        ...state,
        danger: dangerReducer(state.danger, action)
    }),
    [combineActions(...actionsMap(defectsActions))]: (state = {}, action) => ({
        ...state,
        defects: defectsReducer(state.defects, action)
    }),
    [combineActions(...actionsMap(treeManageActions))]: (state = {}, action) => ({
        ...state,
        treeManage: treeManageRducer(state.treeManage, action)
    }),
    [combineActions(...actionsMap(proDocActions))]: (state = {}, action) => ({
        ...state,
        proDoc: proDocReducer(state.proDoc, action)
    }),
    [combineActions(...actionsMap(educationRegisterActions))]: (state = {}, action) => ({
        ...state,
        educationRegister: educationRegisterReducer(state.educationRegister, action)
    }),
    [combineActions(...actionsMap(unbearableActions))]: (state = {}, action) => ({
        ...state,
        unbearable: unbearableReducer(state.unbearable, action)
    }),
    [combineActions(...actionsMap(hiddenDangerActions))]: (state = {}, action) => ({
        ...state,
        hiddenDanger: hiddenDangerReducer(state.hiddenDanger, action)
    }),
    [combineActions(...actionsMap(riskFactorActions))]: (state = {}, action) => ({
        ...state,
        riskFactor: riskFactorReducer(state.riskFactor, action)
    }),
    [combineActions(...actionsMap(riskEvaluationActions))]: (state = {}, action) => ({
        ...state,
        riskEvaluation: riskEvaluationReducer(state.riskEvaluation, action)
    }),
    [combineActions(...actionsMap(formmanageActions))]: (state = {}, action) => ({
        ...state,
        formmanage: formmanageReducer(state.formmanage, action)
    }),
    [combineActions(...actionsMap(engineeringImageActions))]: (state = {}, action) => ({
        ...state,
        engineeringImage: engineeringImageReducer(state.engineeringImage, action)
    }),
    [combineActions(...actionsMap(safetySystemActions))]: (state = {}, action) => ({
        ...state,
        safetySystem: safetySystemReducer(state.safetySystem, action)
    }),
    [combineActions(...actionsMap(nurseryManagementActions))]: (state = {}, action) => ({
        ...state,
        nurseryManagement: nurseryManagementRducer(state.nurseryManagement, action)
    }),
    [combineActions(...actionsMap(auxiliaryAcceptanceActions))]: (state = {}, action) => ({
        ...state,
        auxiliaryAcceptance: auxiliaryAcceptanceRducer(state.auxiliaryAcceptance, action)
    })
}, {});
