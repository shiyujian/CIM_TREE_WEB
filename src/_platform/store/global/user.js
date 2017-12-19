/**
 * Created by tinybear on 17/10/11.
 */
import {handleActions, combineActions,createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API} from '../../api';

const getUserByKeyword = createFetchAction(`${USER_API}/users/?keyword={{keyword}}`,[]);
export const actions = {
    getUserByKeyword
};
