import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import plotManageReducer, {actions as plotManageActions} from './plotManage';
import plotSetReducer, {actions as plotSetActions} from './plotSet';
// import unitReducer, {actions as unitActions} from './unit';
// import sectionReducer, {actions as sectionActions} from './section';
// import siteReducer, {actions as sitenActions} from './site';
import safetySystemReducer, {actions as safetySystemActions} from './safetySystem';
import standardReducer, {actions as standardActions} from './standard';
import keywordReducer, {actions as keywordActions} from './keyword';
// import userReducer, {actions as userActions} from './user';
import orgTypeReducer, {actions as orgTypeActions} from './orgType';
import templateReducer, {actions as templateActions} from './template';
import dictionariesReducer, {actions as dictionariesActions} from './dictionaries';
import dangerReducer, {actions as dangerActions} from './danger';
import hazardReducer, {actions as hazardActions} from './hazard';
import defectsReducer, {actions as defectsActions} from './defects';
// import accidentReducer, {actions as accidentActions} from './accident';

export default handleActions({
	// [combineActions(...actionsMap(accidentActions))]: (state = {}, action) => ({
	// 	...state,
	// 	accident: accidentReducer(state.accident, action),
	// }),
	[combineActions(...actionsMap(defectsActions))]: (state = {}, action) => ({
		...state,
		defects: defectsReducer(state.defects, action),
	}),
	[combineActions(...actionsMap(dangerActions))]: (state = {}, action) => ({
		...state,
		danger: dangerReducer(state.danger, action),
	}),
	[combineActions(...actionsMap(hazardActions))]: (state = {}, action) => ({
		...state,
		hazard: hazardReducer(state.hazard, action),
	}),
	[combineActions(...actionsMap(dictionariesActions))]: (state = {}, action) => ({
		...state,
		dictionaries: dictionariesReducer(state.dictionaries, action),
	}),
	[combineActions(...actionsMap(plotManageActions))]: (state = {}, action) => ({
		...state,
		plotManage: plotManageReducer(state.plotManage, action),
	}),
	[combineActions(...actionsMap(plotSetActions))]: (state = {}, action) => ({
		...state,
		plotSet: plotSetReducer(state.plotSet, action),
	}),
	// [combineActions(...actionsMap(unitActions))]: (state = {}, action) => ({
	// 	...state,
	// 	unit: unitReducer(state.unit, action),
	// }),
	// [combineActions(...actionsMap(sectionActions))]: (state = {}, action) => ({
	// 	...state,
	// 	section: sectionReducer(state.section, action),
	// }),
	// [combineActions(...actionsMap(sitenActions))]: (state = {}, action) => ({
	// 	...state,
	// 	site: siteReducer(state.site, action),
	// }),
	[combineActions(...actionsMap(standardActions))]: (state = {}, action) => ({
		...state,
		standard: standardReducer(state.standard, action),
	}),
	[combineActions(...actionsMap(keywordActions))]: (state = {}, action) => ({
		...state,
		keyword: keywordReducer(state.keyword, action),
	}),
	[combineActions(...actionsMap(safetySystemActions))]: (state = {}, action) => ({
		...state,
		safetySystem: safetySystemReducer(state.safetySystem, action),
	}),
	// [combineActions(...actionsMap(userActions))]: (state = {}, action) => ({
	// 	...state,
	// 	user: userReducer(state.user, action),
	// }),
	[combineActions(...actionsMap(orgTypeActions))]: (state = {}, action) => ({
		...state,
		orgType: orgTypeReducer(state.orgType, action),
	}),
	[combineActions(...actionsMap(templateActions))]: (state = {}, action) => ({
		...state,
		template: templateReducer(state.template, action),
	}),
}, {});