/**
 * Created by tinybear on 17/10/11.
 */
import { handleActions, combineActions, createAction } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { FOREST_API } from '../../api';

export const getAllUsersData = createFetchAction(
    `${FOREST_API}/system/users`,
    [],
    'GET'
);
export const actions = {
    getAllUsersData
};
