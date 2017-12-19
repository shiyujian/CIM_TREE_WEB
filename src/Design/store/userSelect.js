/**
 * Created by tinybear on 17/8/31.
 */

import {handleActions, combineActions,createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API,SERVICE_API} from '_platform/api';

const getUserByKeyword = createFetchAction(`${USER_API}/users/?keyword={{keyword}}`,[]);
const getOrgsByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{CODE}}/`,[]);
const getUsers = createFetchAction(`${USER_API}/users/`,[]);

export const actions = {
    getUserByKeyword,
    getOrgsByCode,
    getUsers
};


