import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import fieldReducer, {actions as fieldActions} from './field';
import projectReducer, {actions as projectActions} from './project';
import unitReducer, {actions as unitActions} from './unit';
import sectionReducer, {actions as sectionActions} from './section';
import siteReducer, {actions as sitenActions} from './site';
import engineerReducer, {actions as engineerActions} from './engineering';
import standardReducer, {actions as standardActions} from './standard';
import keywordReducer, {actions as keywordActions} from './keyword';
import userReducer, {actions as userActions} from './user';
import orgReducer, {actions as orgActions} from './org';
import templateReducer, {actions as templateActions} from './template';
import dictionariesReducer, {actions as dictionariesActions} from './dictionaries';
import dangerReducer, {actions as dangerActions} from './danger';
import hazardReducer, {actions as hazardActions} from './hazard';
import defectsReducer, {actions as defectsActions} from './defects';
import accidentReducer, {actions as accidentActions} from './accident';

export default handleActions({
	[combineActions(...actionsMap(accidentActions))]: (state = {}, action) => ({
		...state,
		accident: accidentReducer(state.accident, action),
	}),
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
	[combineActions(...actionsMap(fieldActions))]: (state = {}, action) => ({
		...state,
		field: fieldReducer(state.field, action),
	}),
	[combineActions(...actionsMap(projectActions))]: (state = {}, action) => ({
		...state,
		project: projectReducer(state.project, action),
	}),
	[combineActions(...actionsMap(unitActions))]: (state = {}, action) => ({
		...state,
		unit: unitReducer(state.unit, action),
	}),
	[combineActions(...actionsMap(sectionActions))]: (state = {}, action) => ({
		...state,
		section: sectionReducer(state.section, action),
	}),
	[combineActions(...actionsMap(sitenActions))]: (state = {}, action) => ({
		...state,
		site: siteReducer(state.site, action),
	}),
	[combineActions(...actionsMap(standardActions))]: (state = {}, action) => ({
		...state,
		standard: standardReducer(state.standard, action),
	}),
	[combineActions(...actionsMap(keywordActions))]: (state = {}, action) => ({
		...state,
		keyword: keywordReducer(state.keyword, action),
	}),
	[combineActions(...actionsMap(engineerActions))]: (state = {}, action) => ({
		...state,
		engineering: engineerReducer(state.engineering, action),
	}),
	[combineActions(...actionsMap(userActions))]: (state = {}, action) => ({
		...state,
		user: userReducer(state.user, action),
	}),
	[combineActions(...actionsMap(orgActions))]: (state = {}, action) => ({
		...state,
		org: orgReducer(state.org, action),
	}),
	[combineActions(...actionsMap(templateActions))]: (state = {}, action) => ({
		...state,
		template: templateReducer(state.template, action),
	}),
}, {});