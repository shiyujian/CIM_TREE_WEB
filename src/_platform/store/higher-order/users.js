import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API,SUSER_API,base} from '../../api';
import {capitalize} from '../util';

export default (ID, service = '') => {
	const suffix = service.toUpperCase();
	const SERVICE = capitalize(service);
	const getUsersOK = createAction(`${ID}_GET_USERS_OK_${suffix}`);
	const updateUsers = createAction(`${ID}_UPDATE_USERS_OK_${suffix}`);
	const getUsers = createFetchAction(`${USER_API}/users/`, [getUsersOK]);
	const getUsersPage = createFetchAction(`${USER_API}/users/?page={{page}}`,'GET');
	const postUser = createFetchAction(`${SUSER_API}/system/suser`, [], 'POST');
	const postUsers = createFetchAction(`${SUSER_API}/system/susers`, [], 'POST');
	const deleteUser = createFetchAction(`${SUSER_API}/system/user/{{userID}}`, [], 'DELETE');
	const putUser = createFetchAction(`${SUSER_API}/system/suser`, [], 'PUT');
	const putUserBlackList = createFetchAction(`${base}/accounts/api/user/{{userID}}/black/`, [], 'PUT');
	// const putUserBlackList = createFetchAction(`http://172.20.64.68:9595/accounts/api/user/13360/black/`, [], 'PUT');
	const usersReducer = handleActions({
		[getUsersOK]: (state, {payload}) => {
			if(payload){
				if(payload.results){
					return payload.results.map((user, index) => ({index, ...user.account, ...user}))
				}else{
					return payload.map((user, index) => ({index, ...user.account, ...user}))
				}
			}
		},
		[updateUsers]: (state) => {
			return state
		},
	}, []);

	usersReducer[`get${SERVICE}Users`] = getUsers;
	usersReducer[`get${SERVICE}UsersPage`] = getUsersPage;
	usersReducer[`get${SERVICE}UsersOK`] = getUsersOK;
	usersReducer[`update${SERVICE}Users`] = updateUsers;
	usersReducer[`post${SERVICE}User`] = postUser;
	usersReducer[`post${SERVICE}Users`] = postUsers;
	usersReducer[`put${SERVICE}User`] = putUser;
	usersReducer[`put${SERVICE}UserBlackList`] = putUserBlackList;
	usersReducer[`delete${SERVICE}User`] = deleteUser;
	return usersReducer;
};
