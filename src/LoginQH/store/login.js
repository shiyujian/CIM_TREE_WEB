import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {
    WORKFLOW_API,
    VALIDATE_API,
    SYSTEM_API
} from '_platform/api';

// 忘记密码 找回密码
const forgectOK = createAction('发送成功');

const getTasks = createFetchAction(`${WORKFLOW_API}/participant-task/`);

const loginForest = createFetchAction(`${SYSTEM_API}/login`, [], 'GET');

const getSecurityCode = createFetchAction(`${VALIDATE_API}`, [], 'GET');
// 获取APK更新
const getAPKUpdateInfo = createFetchAction(`${SYSTEM_API}/updateinfo?package=com.weimap.rfid.product&version=100&channel=wmap`, [], 'GET');

export const actions = {
    forgectOK,
    getTasks,
    loginForest,
    getSecurityCode,
    getAPKUpdateInfo
};
export default handleActions({
    [forgectOK]: (state, action) => {
        return {...state, userData: action.payload};
    }
}, {});
