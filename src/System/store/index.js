import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import projectReducer, { actions as projectActions } from './project';
import roleReducer, { actions as roleActions } from './role';
import permissionReducer, { actions as permissionActions } from './permission';

import frameworkReducer, * as frameworkActions from './framework';
import videoReducer, { actions as videoActions } from './video';
import codeReducer, { actions as codeActions } from './code';
import dictReducer, { actions as dictActions } from './dict';
import createReducer, { actions as createActions } from './create';
import conventionReducer, { actions as conventionActions } from './convention';
import dangerReducer, { actions as dangerActions } from './danger';
import hazardReducer, { actions as hazardActions } from './hazard';
import defectsReducer, { actions as defectsActions } from './defects';
import accidentReducer, { actions as accidentActions } from './accident';
import majorReducer, { actions as majorActions } from './major';
import documentReducer, { actions as documentActions } from './document';
import tagReducer, { actions as tagActions } from './tag';
import quantitiesReducer, { actions as quantitiesActions } from './quantities';
import personReducer, { actions as personActions } from './person';
import orgReducer, { actions as orgActions } from './org';
import orgdataReducer, { actions as orgdataActions } from './orgdata';
import qualityDataReducer, { actions as qualityDataActions } from './quality';
import persondataReducer, { actions as persondataActions } from './persondata';
import persondata1Reducer, { actions as persondata1Actions } from './persondata1';
import blacklistReducer, { actions as blacklistActions } from './blacklist';


export default handleActions({
	[combineActions(...actionsMap(quantitiesActions))]: (state = {}, action) => ({
		...state,
		quantities: quantitiesReducer(state.quantities, action),
	}),
	[combineActions(...actionsMap(tagActions))]: (state = {}, action) => ({
		...state,
		tag: tagReducer(state.tag, action),
	}),
	[combineActions(...actionsMap(documentActions))]: (state = {}, action) => ({
		...state,
		document: documentReducer(state.document, action),
	}),
	[combineActions(...actionsMap(dangerActions))]: (state = {}, action) => ({
		...state,
		danger: dangerReducer(state.danger, action),
	}),
	[combineActions(...actionsMap(projectActions))]: (state = {}, action) => ({
		...state,
		project: projectReducer(state.project, action),
	}),
	[combineActions(...actionsMap(roleActions))]: (state = {}, action) => ({
		...state,
		role: roleReducer(state.role, action),
	}),
	[combineActions(...actionsMap(permissionActions))]: (state = {}, action) => ({
		...state,
		permission: permissionReducer(state.permission, action),
	}),
	[combineActions(...actionsMap(frameworkActions))]: (state = {}, action) => {
		const framework = state.framework;
		return {
			...state,
			framework: frameworkReducer(framework, action),
		}
	},
	[combineActions(...actionsMap(videoActions))]: (state = {}, action) => {
		return {
			...state,
			video: videoReducer(state.video, action),
		}
	},
	[combineActions(...actionsMap(codeActions))]: (state = {}, action) => ({
		...state,
		code: codeReducer(state.code, action),
	}),
	[combineActions(...actionsMap(dictActions))]: (state = {}, action) => ({
		...state,
		dict: dictReducer(state.dict, action),
	}),
	[combineActions(...actionsMap(createActions))]: (state = {}, action) => ({
		...state,
		create: createReducer(state.create, action),
	}),
	[combineActions(...actionsMap(conventionActions))]: (state = {}, action) => ({
		...state,
		convention: conventionReducer(state.convention, action),
	}),
	[combineActions(...actionsMap(hazardActions))]: (state = {}, action) => ({
		...state,
		hazard: hazardReducer(state.hazard, action),
	}),
	[combineActions(...actionsMap(defectsActions))]: (state = {}, action) => ({
		...state,
		defects: defectsReducer(state.defects, action),
	}),
	[combineActions(...actionsMap(accidentActions))]: (state = {}, action) => ({
		...state,
		accident: accidentReducer(state.accident, action),
	}),
	[combineActions(...actionsMap(majorActions))]: (state = {}, action) => ({
		...state,
		major: majorReducer(state.major, action),
	}),
	[combineActions(...actionsMap(personActions))]: (state = {}, action) => ({
		...state,
		person: personReducer(state.person, action),
	}),
	[combineActions(...actionsMap(orgActions))]: (state = {}, action) => ({
		...state,
		org: orgReducer(state.org, action),
	}),
	// 组织机构
	[combineActions(...actionsMap(orgdataActions))]: (state = {}, action) => ({
		...state,
		orgdata: orgdataReducer(state.orgdata, action),
	}),
	//质量信息
	[combineActions(...actionsMap(qualityDataActions))]: (state = {}, action) => ({
		...state,
		qualityData: qualityDataReducer(state.qualityData, action),
	}),
	//人员信息
	[combineActions(...actionsMap(persondataActions))]: (state = {}, action) => ({
		...state,
		persondata: persondataReducer(state.persondata, action),
	}),
	//人员信息1
	[combineActions(...actionsMap(persondata1Actions))]: (state = {}, action) => ({
		...state,
		persondata1: persondata1Reducer(state.persondata1, action),
	}),
	//黑名单
	[combineActions(...actionsMap(blacklistActions))]: (state = {}, action) => ({
		...state,
		blacklist: blacklistReducer(state.blacklist, action),
	}),
}, {});
