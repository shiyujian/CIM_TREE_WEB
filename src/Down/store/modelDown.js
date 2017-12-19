/**
 * Created by pans0911 on 2017/4/20.
 */
import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API} from '_platform/api';


const getUsersOK = createAction('测试的');


//获取用户列表
const getUsers = createFetchAction(`${USER_API}/users/`, [getUsersOK]);

export const actions = {
    getUsers,
    getUsersOK,
};
export default handleActions({
	[getUsersOK]: (state, {payload}) => {
		return {
			...state,
			users: payload
		}
	},

}, {});
