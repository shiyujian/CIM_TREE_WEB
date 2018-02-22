/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {combineReducers} from 'redux';
import { USER_API,SERVICE_API} from '_platform/api';

export const getORGTreeOK = createAction('获取部门多级树');
export const getORGTree = createFetchAction(`${SERVICE_API}/org-tree/{{pk}}/`,[getORGTreeOK]);

export const getORGMemberOK = createAction('获取部门人员');
export const getORGMember = createFetchAction(`${USER_API}/users/`,[getORGMemberOK]);


export const actions = {
    getORGTreeOK,
    getORGTree,
    getORGMemberOK,
	getORGMember
};

export default handleActions({
    [getORGTreeOK]: (state, {payload}) => {
        return{
            ...state,
            orgTree: payload
        }
    },
    [getORGMemberOK]: (state, {payload}) => {
        return{
            ...state,
            ORGMember: payload
        }
    }
}, {});
