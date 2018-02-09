import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import plotManageReducer, {actions as plotManageActions} from './plotManage';
import areaManageReducer, {actions as areaManageActions} from './areaManage';
import sectionManageReducer, {actions as sectionManageActions} from './sectionManage';
import smallclassReducer, {actions as smallclassActions} from './smallclass';
import thinclassReducer, {actions as thinclassActions} from './thinclass';

import plotSetReducer, {actions as plotSetActions} from './plotSet';
import areaSetReducer, {actions as areaSetActions} from './areaSet';
import unitProReducer, {actions as unitProActions} from './unitPro';
import subunitProReducer, {actions as subunitProActions} from './subunitPro';
import subProReducer, {actions as subProActions} from './subPro';
import itemProReducer, {actions as itemProActions} from './itemPro';
// import unitReducer, {actions as unitActions} from './unit';
// import sectionReducer, {actions as sectionActions} from './section';
// import siteReducer, {actions as sitenActions} from './site';
import safetySystemReducer, {actions as safetySystemActions} from './safetySystem';
import standardReducer, {actions as standardActions} from './standard';
import proDocReducer, {actions as proDocActions} from './proDoc';
import educationRegisterReducer, {actions as educationRegisterActions} from './educationRegister';
import unbearableReducer, {actions as unbearableActions} from './unbearable';
import hiddenDangerReducer, {actions as hiddenDangerActions} from './hiddenDanger';
import riskFactorReducer, {actions as riskFactorActions} from './riskFactor';
import materialReducer, {actions as materialActions} from './material';
import formmanageReducer, {actions as formmanageActions} from './formmanage';
import engineeringImageReducer, {actions as engineeringImageActions} from './engineeringImage';
import keywordReducer, {actions as keywordActions} from './keyword';
// import userReducer, {actions as userActions} from './user';
import orgTypeReducer, {actions as orgTypeActions} from './orgType';
import unitManageReducer, {actions as unitManageActions} from './unitManage';
import branchManageReducer, {actions as branchManageActions} from './branchManage';


import templateReducer, {actions as templateActions} from './template';
import dictionariesReducer, {actions as dictionariesActions} from './dictionaries';
import dangerReducer, {actions as dangerActions} from './danger';
import hazardReducer, {actions as hazardActions} from './hazard';
import defectsReducer, {actions as defectsActions} from './defects';
// import accidentReducer, {actions as accidentActions} from './accident';
import nurseryTypeRducer, {actions as nurseryTypeActions} from './nurseryType';
import treeManageRducer, {actions as treeManageActions} from './treeManage';
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
	[combineActions(...actionsMap(areaManageActions))]: (state = {}, action) => ({
		...state,
		areaManage: areaManageReducer(state.areaManage, action),
	}),
	[combineActions(...actionsMap(sectionManageActions))]: (state = {}, action) => ({
		...state,
		sectionManage: sectionManageReducer(state.sectionManage, action),
	}),
	[combineActions(...actionsMap(smallclassActions))]: (state = {}, action) => ({
		...state,
		smallclass: smallclassReducer(state.smallclass, action),
	}),
	[combineActions(...actionsMap(thinclassActions))]: (state = {}, action) => ({
		...state,
		thinclass: thinclassReducer(state.thinclass, action),
	}),
	[combineActions(...actionsMap(plotSetActions))]: (state = {}, action) => ({
		...state,
		plotSet: plotSetReducer(state.plotSet, action),
	}),
	[combineActions(...actionsMap(areaSetActions))]: (state = {}, action) => ({
		...state,
		areaSet: areaSetReducer(state.areaSet, action),
	}),
	[combineActions(...actionsMap(unitProActions))]: (state = {}, action) => ({
		...state,
		unitPro: unitProReducer(state.unitPro, action),
	}),
	[combineActions(...actionsMap(subunitProActions))]: (state = {}, action) => ({
		...state,
		subunitPro: subunitProReducer(state.subunitPro, action),
	}),
	[combineActions(...actionsMap(subProActions))]: (state = {}, action) => ({
		...state,
		subPro: subProReducer(state.subPro, action),
	}),
	[combineActions(...actionsMap(itemProActions))]: (state = {}, action) => ({
		...state,
		itemPro: itemProReducer(state.itemPro, action),
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
	[combineActions(...actionsMap(proDocActions))]: (state = {}, action) => ({
		...state,
		proDoc: proDocReducer(state.proDoc, action),
	}),
	[combineActions(...actionsMap(educationRegisterActions))]: (state = {}, action) => ({
		...state,
		educationRegister: educationRegisterReducer(state.educationRegister, action),
	}),
	[combineActions(...actionsMap(unbearableActions))]: (state = {}, action) => ({
		...state,
		unbearable: unbearableReducer(state.unbearable, action),
	}),
	[combineActions(...actionsMap(hiddenDangerActions))]: (state = {}, action) => ({
		...state,
		hiddenDanger: hiddenDangerReducer(state.hiddenDanger, action),
	}),
	[combineActions(...actionsMap(riskFactorActions))]: (state = {}, action) => ({
		...state,
		riskFactor: riskFactorReducer(state.riskFactor, action),
	}),
	[combineActions(...actionsMap(materialActions))]: (state = {}, action) => ({
		...state,
		material: materialReducer(state.material, action),
	}),
	[combineActions(...actionsMap(formmanageActions))]: (state = {}, action) => ({
		...state,
		formmanage: formmanageReducer(state.formmanage, action),
	}),
	[combineActions(...actionsMap(engineeringImageActions))]: (state = {}, action) => ({
		...state,
		engineeringImage: engineeringImageReducer(state.engineeringImage, action),
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
	[combineActions(...actionsMap(unitManageActions))]: (state = {}, action) => ({
		...state,
		unitManage: unitManageReducer(state.unitManage, action),
	}),
	[combineActions(...actionsMap(branchManageActions))]: (state = {}, action) => ({
		...state,
		branchManage: branchManageReducer(state.branchManage, action),
	}),
	[combineActions(...actionsMap(templateActions))]: (state = {}, action) => ({
		...state,
		template: templateReducer(state.template, action),
	}),
	[combineActions(...actionsMap(nurseryTypeActions))]: (state = {}, action) => ({
		...state,
		nurseryType: nurseryTypeRducer(state.nurseryType, action),
	}),
	[combineActions(...actionsMap(treeManageActions))]: (state = {}, action) => ({
		...state,
		treeManage: treeManageRducer(state.treeManage, action),
	}),
}, {});