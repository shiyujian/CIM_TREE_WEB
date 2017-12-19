/**
 * Created by du on 2017/5/22.
 */
import createFetchAction from 'fetch-action';
import {createAction, handleActions} from 'redux-actions';
import {USER_API} from '_platform/api';

export default (ID) => {
    const getUsersOK = createAction(`${ID}_获取用户列表`);
    const getUsers = createFetchAction(`${USER_API}/users/`,
        [getUsersOK]);
    const userReducer = handleActions({
        [getUsersOK]: (state, {payload = []}) => {
            const organizationMap = {};
            payload.forEach(user => {
                const account = user.account || {};
                const {organization, person_name} = account;
                if (organization && organizationMap[organization] &&
                    organizationMap[organization].length) {
                    organizationMap[organization].push(user);
                } else {
                    organizationMap[organization] = [user];
                }
            });
            return Object.keys(organizationMap).map((key => {
                return {
                    key,
                    org: organizationMap[key],
                };
            }));
        },
    }, []);
    userReducer.getUsersOK = getUsersOK;
    userReducer.getUsers = getUsers;
    return userReducer;
};
