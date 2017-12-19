import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {SERVICE_API,base} from '_platform/api';

export const ID = 'SAFETYGOAL';

const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');

//安全目标
const getSafetyGoal = createFetchAction(`${base}/main/api/safety-goal/`,[],'GET');
const postSafetyGoal = createFetchAction(`${base}/main/api/safety-goal/`,[],'POST');
const patchSafetyGoal = createFetchAction(`${base}/main/api/safety-goal/{{pk}}/`,[],'PATCH');
const deleteSafetyGoal = createFetchAction(`${base}/main/api/safety-goal/{{pk}}/`,[],'DELETE');

//安全目标分解
const getPersonSafetyGoal = createFetchAction(`${base}/main/api/person-safety-goal/`,[],'GET');
const postPersonSafetyGoal = createFetchAction(`${base}/main/api/person-safety-goal/`,[],'POST');
const patchPersonSafetyGoal = createFetchAction(`${base}/main/api/person-safety-goal/{{pk}}/`,[],'PATCH');
const deletePersonSafetyGoal = createFetchAction(`${base}/main/api/person-safety-goal/{{pk}}/`,[],'DELETE');

//目标月考核
const postMonthSafetyGoal = createFetchAction(`${base}/main/api/person-safety-goal/{{pk}}/month-check/`,[],'POST');
const patchMonthSafetyGoal = createFetchAction(`${base}/main/api/persafety-month-check/{{pk}}/`,[],'PATCH');

//目标年考核
const postYearSafetyGoal = createFetchAction(`${base}/main/api/person-safety-goal/{{pk}}/year-check/`,[],'POST');
const patchYearSafetyGoal = createFetchAction(`${base}/main/api/persafety-year-check/{{pk}}/`,[],'PATCH');

export const actions = {
	getWorkpackagesByCode,
	getSafetyGoal,
	postSafetyGoal,
	patchSafetyGoal,
	deleteSafetyGoal,
	getPersonSafetyGoal,
	postPersonSafetyGoal,
	patchPersonSafetyGoal,
	deletePersonSafetyGoal,
	postMonthSafetyGoal,
	patchMonthSafetyGoal,
	postYearSafetyGoal,
	patchYearSafetyGoal,
};

export default handleActions({
	
}, {});
