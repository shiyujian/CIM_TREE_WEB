import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    MAIN_API
} from '_platform/api';

export const ID = 'Checkwork_electronicfence';
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);
// 获取考勤群体
export const getCheckGroupOK = createAction(`${ID}_getCheckGroup`);
export const getCheckGroup = createFetchAction(`${MAIN_API}/check-group/`, [getCheckGroupOK], 'GET');

// 获取群体下的所有围栏
export const getCheckScope = createFetchAction(`${MAIN_API}/group/{{id}}/scope/`, [], 'GET');

// 为群体设置电子围栏
export const postCheckScope = createFetchAction(`${MAIN_API}/group/{{id}}/scope/`, [], 'POST');

// 更新群体的电子围栏信息
export const putCheckScope = createFetchAction(`${MAIN_API}/scope/{{id}}/`, [], 'PUT');

// 删除该群体的电子围栏
export const deleteCheckScope = createFetchAction(`${MAIN_API}/scope/{{id}}/`, [], 'DELETE');

export const actions = {
    changeSelectMap,
    getCheckGroupOK,
    getCheckGroup,
    getCheckScope,
    postCheckScope,
    putCheckScope,
    deleteCheckScope
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    }),
    [getCheckGroupOK]: (state, {payload}) => ({
        ...state,
        checkGroupsData: payload
    })
}, {});
