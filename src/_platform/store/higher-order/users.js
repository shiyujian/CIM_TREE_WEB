import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '../fetchAction';
import { USER_API, SUSER_API, FOREST_API } from '../../api';
import { capitalize } from '../util';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getUsersOK = createAction(`${ID}_GET_USERS_OK_${suffix}`);
    const getUsers = createFetchAction(`${USER_API}/users/`, [getUsersOK]);
    const getUsersPage = createFetchAction(
        `${USER_API}/users/?page={{page}}`,
        'GET'
    );
    const postForestUser = createFetchAction(`${SUSER_API}/system/suser`, [], 'POST');
    const deleteForestUser = createFetchAction(
        `${SUSER_API}/system/user/{{userID}}`,
        [],
        'DELETE'
    );
    const putForestUser = createFetchAction(`${SUSER_API}/system/suser`, [], 'PUT');
    const postForestUserBlackList = forestFetchAction(
        `${FOREST_API}/system/blacksuser`,
        [],
        'POST'
    );
    const postForestUserBlackDisabled = forestFetchAction(
        `${FOREST_API}/system/blacksuser`,
        [],
        'POST'
    );
    const usersReducer = handleActions(
        {
            [getUsersOK]: (state, { payload }) => {
                if (payload) {
                    if (payload.results) {
                        return payload.results.map((user, index) => ({
                            index,
                            ...user.account,
                            ...user
                        }));
                    } else {
                        return payload.map((user, index) => ({
                            index,
                            ...user.account,
                            ...user
                        }));
                    }
                }
            }
        },
        []
    );

    usersReducer[`get${SERVICE}Users`] = getUsers;
    usersReducer[`get${SERVICE}UsersPage`] = getUsersPage;
    usersReducer[`get${SERVICE}UsersOK`] = getUsersOK;
    usersReducer[`post${SERVICE}ForestUser`] = postForestUser;
    usersReducer[`put${SERVICE}ForestUser`] = putForestUser;
    usersReducer[`post${SERVICE}ForestUserBlackList`] = postForestUserBlackList;
    usersReducer[`post${SERVICE}ForestUserBlackDisabled`] = postForestUserBlackDisabled;

    usersReducer[`delete${SERVICE}ForestUser`] = deleteForestUser;
    return usersReducer;
};
