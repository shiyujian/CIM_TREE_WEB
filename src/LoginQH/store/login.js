import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, WORKFLOW_API, FOREST_API} from '_platform/api';

// 忘记密码 找回密码
const forgectOK = createAction('发送成功');
const forgect = createFetchAction(`${USER_API}/security-code/`, [forgectOK], 'POST');

const getTasks = createFetchAction(`${WORKFLOW_API}/participant-task/`);

const loginForest = createFetchAction(`${FOREST_API}/system/login`, [], 'GET');

const getUserPermission = createFetchAction(`${FOREST_API}/system/functions`, [], 'GET');

const getSecurityCode = createFetchAction(`${FOREST_API}/ValidateHandler.ashx`, [], 'GET');

export const actions = {
    forgectOK,
    forgect,
    getTasks,
    loginForest,
    getUserPermission,
    getSecurityCode
};
export default handleActions({
    [forgectOK]: (state, action) => {
        return {...state, userData: action.payload};
    }
}, {});
