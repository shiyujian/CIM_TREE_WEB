import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API,WORKFLOW_API,QRCODE_API} from '_platform/api';

export const loginOK = createAction('登录成功');
export const login = createFetchAction(`${USER_API}/user/login2/`, [loginOK],'POST');
//忘记密码 找回密码
export const forgectOK = createAction('发送成功');
export const forgect = createFetchAction(`${USER_API}/security-code/`, [forgectOK],'POST');

export const getTasks = createFetchAction(`${WORKFLOW_API}/participant-task/`);

export const getTokenOK = createAction('获取二维码登陆token');
export const getToken = createFetchAction(`${QRCODE_API}/qrcode/`, [],'GET');

export const getLoginStateOK = createAction('二维码登录信息');
export const getLoginState = createFetchAction(`${QRCODE_API}/qrcode/{{token}}/`, [],'GET');

export default handleActions({
	[loginOK]: (state, action) => {
		return {...state, userData: action.payload}
	},
	[forgectOK]: (state, action) => {
		return {...state, userData: action.payload}
	},
	[getTokenOK]: (state, {payload}) => ({
        ...state,
		token: payload.token,
		url: payload.url,
	}),
	[getLoginStateOK]: (state, {payload}) => ({
        ...state,
		tokenUser: payload.user,
    }),
}, {});