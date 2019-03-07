import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, WORKFLOW_API, FOREST_API} from '_platform/api';

export const loginOK = createAction('登录成功');
export const login = createFetchAction(`${USER_API}/user/login2/`, [loginOK], 'POST');
// 忘记密码 找回密码
export const forgectOK = createAction('发送成功');
export const forgect = createFetchAction(`${USER_API}/security-code/`, [forgectOK], 'POST');

export const getTasks = createFetchAction(`${WORKFLOW_API}/participant-task/`);

export const loginForest = createFetchAction(`${FOREST_API}/system/login`, [], 'GET');

export default handleActions({
    [loginOK]: (state, action) => {
        return {...state, userData: action.payload};
    },
    [forgectOK]: (state, action) => {
        return {...state, userData: action.payload};
    }
}, {});
