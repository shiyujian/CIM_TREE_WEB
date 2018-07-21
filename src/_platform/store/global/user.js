/**
 * Created by tinybear on 17/10/11.
 */
import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, FOREST_API} from '../../api';

const getUserByKeyword = createFetchAction(`${USER_API}/users/?keyword={{keyword}}`, []);
export const getAllUsersData = createFetchAction(`${FOREST_API}/system/users`, [], 'GET');
export const actions = {
    getUserByKeyword,
    getAllUsersData
};
