import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';

import blueprintReducer, {actions as blueprintActions} from './blueprint';
import noticeReducer, {actions as noticeActions} from './notice';
import monitorReducer, {actions as monitorActions} from './monitor';
import planReducer,{actions as planActions} from './plan';
import designChangeReducer,{actions as designActions} from './designChange';
import remindReducer,{actions as remindActions} from  './remind';
import dashboardReducer,{actions as dashboardActions} from  './dashboard';
//---设计交底---
import designExpReducer,{actions as designExpActions} from './designExp';
//------

export default handleActions({
	//---designExp---
	[combineActions(...actionsMap(designExpActions))]: (state, action) => ({
		...state,
		designExp: designExpReducer(state.designExp, action)
	}),
	//------
	[combineActions(...actionsMap(blueprintActions))]: (state, action) => ({
		...state,
		blueprint: blueprintReducer(state.blueprint, action)
	}),
	[combineActions(...actionsMap(noticeActions))]: (state, action) => ({
		...state,
		notice: noticeReducer(state.notice, action)
	}),
	[combineActions(...actionsMap(monitorActions))]: (state, action) => ({
		...state,
		monitor: monitorReducer(state.monitor, action)
	}),
	[combineActions(...actionsMap(planActions))]:(state,action)=>({
		...state,
		plan: planReducer(state.plan,action)
	}),
	[combineActions(...actionsMap(designActions))]:(state,action)=>({
		...state,
		designChange:designChangeReducer(state.designChange,action)
	}),
	[combineActions(...actionsMap(remindActions))]:(state,action)=>({
		...state,
		remind:remindReducer(state.remind,action)
	}),
	[combineActions(...actionsMap(dashboardActions))]:(state,action)=>({
		...state,
		dashboard:dashboardReducer(state.dashboard,action)
	})
}, {});
