import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SYSTEM_API
} from '_platform/api';

export const ID = 'Checkwork_electronicfence';
// 获取考勤群体
export const getCheckGroupOK = createAction(`${ID}_getCheckGroup`);
export const getCheckGroup = createFetchAction(`${SYSTEM_API}/checkgroups`, [getCheckGroupOK], 'GET');

// 获取群体下的所有围栏
export const getCheckScope = createFetchAction(`${SYSTEM_API}/group/{{id}}/scope/`, [], 'GET');

// 为群体设置电子围栏
export const postCheckScope = createFetchAction(`${SYSTEM_API}/group/{{id}}/scope/`, [], 'POST');

// 更新群体的电子围栏信息
export const putCheckScope = createFetchAction(`${SYSTEM_API}/scope/{{id}}/`, [], 'PUT');

// 删除该群体的电子围栏
export const deleteCheckScope = createFetchAction(`${SYSTEM_API}/scope/{{id}}/`, [], 'DELETE');

export const actions = {
    getCheckGroupOK,
    getCheckGroup,
    getCheckScope,
    postCheckScope,
    putCheckScope,
    deleteCheckScope
};
export default handleActions({
    [getCheckGroupOK]: (state, {payload}) => {
        if (payload && payload.content && payload.content instanceof Array) {
            let data = {
                checkGroupsData: payload.content
            };
            return data;
        } else {
            return {checkGroupsData: []};
        }
    }
}, {});
