import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import {CODE_API, CODE_PROJECT,SERVICE_API} from '_platform/api';
const getOrgInfo = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/?all=true`,[],'GET');
export const actions = {
    getOrgInfo
};
