import {createAction,handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {SERVICE_API,WORKFLOW_API,WORKFLOW_CODE} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';
import documentFactory from '_platform/store/higher-order/doc';

export const ID = 'remind';
export const setunitproject = createAction(`${ID}_setunitproject`);
export const getNearWK = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&code=${WORKFLOW_CODE.设计成果上报流程}`,[]);
export const settype = createAction(`${ID}_settype`);
export const getdocumentOK = createAction(`${ID}_getdocument`);
export const getdocument = createFetchAction(`${SERVICE_API}/documentgetlist/`, [getdocumentOK]);
export const setpagination = createAction(`${ID}_setpagination`);
export const savequery = createAction(`${ID}_savequery`);
export const setnewdocument = createAction(`${ID}_setnewdocument`);

export const actions = {
	setunitproject,
	getNearWK,
	settype,
	getdocumentOK,
	getdocument,
	setpagination,
	savequery,
	setnewdocument
};

export default handleActions({
	[setunitproject]: (state, {payload}) => {
		return {
			...state,
			unitProject: payload
		}
	},
	[settype]: (state, {payload}) => ({
			...state,
			type: payload
	}),
	[getdocumentOK]: (state, {payload}) => {
		console.log(payload);
		return {
			...state,
			document: payload
		}
	},
	[setpagination]: (state, {payload}) => ({
		...state,
		pagination: payload
	}),
	[savequery]: (state, {payload}) => ({
		...state,
		savequery: payload
	}),
	[setnewdocument]: (state, {payload}) => ({
		...state,
		newdocument: payload
	}),
}, {});
