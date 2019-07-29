import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '../fetchAction';
import { SYSTEM_API } from '../../api';
import { capitalize } from '../util';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getUsersOK = createAction(`${ID}_GET_USERS_OK_${suffix}`);
    const getUsers = createFetchAction(`${SYSTEM_API}/users`, [getUsersOK]);
    // 获取人员详情
    const getUserDetail = createFetchAction(`${SYSTEM_API}/user/{{id}}`, []);
    // 删除用户
    const deleteForestUser = createFetchAction(`${SYSTEM_API}/user/{{userID}}`, [], 'DELETE');
    // 新增人员
    const postForestUser = createFetchAction(`${SYSTEM_API}/user`, [], 'POST');
    // 修改人员
    const putForestUser = createFetchAction(`${SYSTEM_API}/user`, [], 'PUT');
    const postForestUserBlackList = forestFetchAction(`${SYSTEM_API}/blackuser`, [], 'POST');
    const postForestUserBlackDisabled = forestFetchAction(`${SYSTEM_API}/forbiddenuser`, [], 'POST');
    const usersReducer = handleActions(
        {
            [getUsersOK]: (state, { payload }) => {
                if (payload) {
                    if (payload && payload.content && payload.content instanceof Array) {
                        return payload.content;
                    } else {
                        return [];
                    }
                }
            }
        },
        []
    );

    usersReducer[`get${SERVICE}UsersOK`] = getUsersOK;
    usersReducer[`get${SERVICE}Users`] = getUsers;
    usersReducer[`get${SERVICE}UserDetail`] = getUserDetail;
    usersReducer[`post${SERVICE}ForestUser`] = postForestUser;
    usersReducer[`put${SERVICE}ForestUser`] = putForestUser;
    usersReducer[`post${SERVICE}ForestUserBlackList`] = postForestUserBlackList;
    usersReducer[`post${SERVICE}ForestUserBlackDisabled`] = postForestUserBlackDisabled;

    usersReducer[`delete${SERVICE}ForestUser`] = deleteForestUser;
    return usersReducer;
};
