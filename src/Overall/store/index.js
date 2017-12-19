import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import weeklyReducer, {actions as weeklyActions} from './weekly';
import newsReducer, {actions as newsActions} from './news';
import attendReducer, {actions as attendActions} from './attend';
import packageReducer, {actions as packageActions} from './package';
import docDispatchReducer, {actions as docDispatchActions} from './docdispatch';
import approvalReducer, {actions as approvalActions} from './approval';
import dispatchReducer, {actions as adispatchActions} from './dispatch';



export default handleActions({
	[combineActions(...actionsMap(weeklyActions))]: (state, action) => {
		return {...state, weekly: weeklyReducer(state.weekly, action)};
	},
	[combineActions(...actionsMap(newsActions))]: (state, action) => {
		return {...state, news: newsReducer(state.news, action)};
	},
	[combineActions(...actionsMap(attendActions))]: (state, action) => {
		return {...state, attend: attendReducer(state.attend, action)};
	},
	[combineActions(...actionsMap(packageActions))]: (state, action) => {
		return {...state, dbms: packageReducer(state.dbms, action)};
	},
	[combineActions(...actionsMap(docDispatchActions))]: (state, action) => {
		return {...state, docdispatch: docDispatchReducer(state.docdispatch, action)};
	},
	[combineActions(...actionsMap(approvalActions))]: (state, action) => {
		return {...state, approval: approvalReducer(state.approval, action)};
	},
	[combineActions(...actionsMap(adispatchActions))]: (state, action) => {
		return {...state, dispatch: dispatchReducer(state.dispatch, action)};
	},

}, {});