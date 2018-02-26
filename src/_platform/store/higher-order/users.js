import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API,SUSER_API} from '../../api';
import {capitalize} from '../util';

export default (ID, service = '') => {
	const suffix = service.toUpperCase();
	const SERVICE = capitalize(service);
	const getUsersOK = createAction(`${ID}_GET_USERS_OK_${suffix}`);
	const updateUsers = createAction(`${ID}_UPDATE_USERS_OK_${suffix}`);
	const getUsers = createFetchAction(`${USER_API}/users/`, [getUsersOK]);
	const postUser = createFetchAction(`${SUSER_API}/system/suser`, [], 'POST');
	const deleteUser = createFetchAction(`${SUSER_API}/system/user/{{userID}}`, [], 'DELETE');
	const putUser = createFetchAction(`${SUSER_API}/system/suser`, [], 'PUT');
	const usersReducer = handleActions({
		[getUsersOK]: (state, {payload}) => {
			if(payload){
				return payload.map((user, index) => ({index, ...user.account, ...user}))
			}
		},
		[updateUsers]: (state) => {
			return state
		},
	}, []);

	usersReducer[`get${SERVICE}Users`] = getUsers;
	usersReducer[`get${SERVICE}UsersOK`] = getUsersOK;
	usersReducer[`update${SERVICE}Users`] = updateUsers;
	usersReducer[`post${SERVICE}User`] = postUser;
	usersReducer[`put${SERVICE}User`] = putUser;
	usersReducer[`delete${SERVICE}User`] = deleteUser;
	return usersReducer;
};
