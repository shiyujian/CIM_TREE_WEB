import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';

import commonTreeReducer, {actions as commonTreeActions} from './commonTree';

import registerReducer, {actions as registerActions} from './register';
import schemeReducer, {actions as schemeActions} from './scheme';

import reportReducer, {actions as reportActions} from './report';
import investigationReducer, {actions as investigationActions} from './investigation';
import emergencyPlanReducer, {actions as emergencyPlanActions} from './emergencyPlan';
import treatmentReducer, {actions as treatmentActions} from './treatment';
import managementInstitutionReducer, {actions as managementInstitutionActions} from './managementInstitution';
import organizationalStructureReducer, {actions as organizationalStructureActions} from './organizationalStructure';
import responsibilitySystemReducer, {actions as responsibilitySystemActions} from './responsibilitySystem';
import safetyGoalReducer, {actions as safetyGoalActions} from './safetyGoal';

import dynamicReportReducer, {actions as dynamicReportActions} from './dynamicReport';
import riskFactorReducer, {actions as riskFactorActions} from './riskFactor';
import unbearableReducer, {actions as unbearableActions} from './unbearable';
import riskEvaluationReducer, {actions as riskEvaluationActions} from './riskEvaluation';
import staticFileReducer, {actions as staticFileActions} from './staticFile';

import safetyRulesReducer, {actions as safetyRulesActions} from './safetyRules';
import specialReducer, {actions as specialActions} from './special';
import qualificationVerificationReducer, {actions as qualificationVerificationActions} from './qualificationVerification';
import educationRegisterReducer, {actions as educationRegisterActions} from './educationRegister';
import actionsRecordReducer, {actions as actionsRecordActions} from './actionsRecord';
import technicalDisclosureReducer, {actions as technicalDisclosureActions} from './technicalDisclosure';
import facilitiesAcceptanceReducer, {actions as facilitiesAcceptanceActions} from './facilitiesAcceptance';
import safetyCheckReducer, {actions as safetyCheckActions} from './safetyCheck';
import hiddenDangerReducer, {actions as hiddenDangerActions} from './hiddenDanger';
import safetyMonitorReducer, {actions as safetyMonitorActions} from './safetyMonitor';
import supportReducer, {actions as  supportActions} from './supportActions';

export default handleActions({
	[combineActions(...actionsMap(commonTreeActions))]: (state = {}, action) => ({
		...state,
		commonTree: commonTreeReducer(state.commonTree, action),
	}),

	[combineActions(...actionsMap(schemeActions))]: (state = {}, action) => ({
		...state,
		scheme: schemeReducer(state.scheme, action),
	}),
	[combineActions(...actionsMap(registerActions))]: (state = {}, action) => ({
		...state,
		register: registerReducer(state.register, action),
	}),
	[combineActions(...actionsMap(reportActions))]: (state = {}, action) => ({
		...state,
		report: reportReducer(state.report, action),
	}),
	[combineActions(...actionsMap(investigationActions))]: (state = {}, action) => ({
		...state,
		investigation: investigationReducer(state.investigation, action),
	}),
	[combineActions(...actionsMap(emergencyPlanActions))]: (state = {}, action) => ({
		...state,
		emergencyPlan: emergencyPlanReducer(state.emergencyPlan, action),
	}),
	[combineActions(...actionsMap(treatmentActions))]: (state = {}, action) => ({
		...state,
		treatment: treatmentReducer(state.treatment, action),
	}),
	[combineActions(...actionsMap(managementInstitutionActions))]: (state = {}, action) => ({
		...state,
		managementInstitution: managementInstitutionReducer(state.managementInstitution, action),
	}),
	[combineActions(...actionsMap(organizationalStructureActions))]: (state = {}, action) => ({
		...state,
		organizationalStructure: organizationalStructureReducer(state.organizationalStructure, action),
	}),
	[combineActions(...actionsMap(responsibilitySystemActions))]: (state = {}, action) => ({
		...state,
		responsibilitySystem: responsibilitySystemReducer(state.responsibilitySystem, action),
	}),
	[combineActions(...actionsMap(safetyGoalActions))]: (state = {}, action) => ({
		...state,
		safetyGoal: safetyGoalReducer(state.safetyGoal, action),
	}),
	// [combineActions(...actionsMap(warningActions))]: (state = {}, action) => {
	// 	return {...state, warning: warningReducer(state.warning, action)};
	// },
	[combineActions(...actionsMap(riskEvaluationActions))]: (state = {}, action) => {
		return {...state, riskEvaluation: riskEvaluationReducer(state.riskEvaluation, action)};
	},
	[combineActions(...actionsMap(dynamicReportActions))]: (state = {}, action) => {
		return {...state, dynamicReport: dynamicReportReducer(state.dynamicReport, action)};
	},
	[combineActions(...actionsMap(riskFactorActions))]: (state = {}, action) => {
		return {...state, riskFactor: riskFactorReducer(state.riskFactor, action)};
	},
	[combineActions(...actionsMap(unbearableActions))]: (state = {}, action) => {
		return {...state, unbearable: unbearableReducer(state.unbearable, action)};
	},
	[combineActions(...actionsMap(staticFileActions))]: (state = {}, action) => {
		return {...state, staticFile: staticFileReducer(state.staticFile, action)};
	},
	[combineActions(...actionsMap(safetyRulesActions))]: (state = {}, action) => {
		return {...state, safetyRules: safetyRulesReducer(state.safetyRules, action)};
	},
	[combineActions(...actionsMap(specialActions))]: (state = {}, action) => {
		return {...state, special: specialReducer(state.special, action)};
	},
	[combineActions(...actionsMap(qualificationVerificationActions))]: (state = {}, action) => {
		return {...state, qualificationVerification: qualificationVerificationReducer(state.qualificationVerification, action)};
	},
	[combineActions(...actionsMap(educationRegisterActions))]: (state = {}, action) => {
		return {...state, educationRegister: educationRegisterReducer(state.educationRegister, action)};
	},
	[combineActions(...actionsMap(actionsRecordActions))]: (state = {}, action) => {
		return {...state, actionsRecord: actionsRecordReducer(state.actionsRecord, action)};
	},
	[combineActions(...actionsMap(technicalDisclosureActions))]: (state = {}, action) => {
		return {...state, technicalDisclosure: technicalDisclosureReducer(state.technicalDisclosure, action)};
	},
	[combineActions(...actionsMap(facilitiesAcceptanceActions))]: (state = {}, action) => {
		return {...state, facilitiesAcceptance: facilitiesAcceptanceReducer(state.facilitiesAcceptance, action)};
	},
	[combineActions(...actionsMap(safetyCheckActions))]: (state = {}, action) => {
		return {...state, safetyCheck: safetyCheckReducer(state.safetyCheck, action)};
	},
	[combineActions(...actionsMap(hiddenDangerActions))]: (state = {}, action) => {
		return {...state, hiddenDanger: hiddenDangerReducer(state.hiddenDanger, action)};
	},
	[combineActions(...actionsMap(safetyMonitorActions))]: (state = {}, action) => {
		return {...state, safetyMonitor: safetyMonitorReducer(state.safetyMonitor, action)};
	},
	[combineActions(...actionsMap(supportActions))]: (state = {}, action) => {
		return {...state, support: supportReducer(state.support, action)};
	}
}, {});
