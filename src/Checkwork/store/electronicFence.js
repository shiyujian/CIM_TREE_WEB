import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API,
    base
} from '_platform/api';

export const ID = 'Checkwork_electronicfence';

export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);

// 根据范围查询细班
export const postThinClassesByRegion = createFetchAction(`${FOREST_API}/curing/thinclassesbyregion`, [], 'POST');
// 获取范围内栽植的树木数量
export const postTreeLocationNumByRegion = createFetchAction(`${FOREST_API}/curing/treelocationnumbyregion`, [], 'POST');
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);
// 修改选中节点
export const changeCheckedKeys = createAction(`${ID}_changeCheckedKeys`);

// 获取考勤群体
export const getCheckGroupOK = createAction(`${ID}_getCheckGroup`);
export const getCheckGroup = createFetchAction(`${base}/main/api/check-group/`, [getCheckGroupOK], 'GET');

// 获取群体下的所有围栏
export const getCheckScope = createFetchAction(`${base}/main/api/group/{{id}}/scope/`, [], 'GET');

// 为群体设置电子围栏
export const postCheckScope = createFetchAction(`${base}/main/api/group/{{id}}/scope/`, [], 'POST');

export const actions = {
    getTreearea,
    postThinClassesByRegion,
    postTreeLocationNumByRegion,
    changeSelectMap,
    changeCheckedKeys,
    getCheckGroupOK,
    getCheckGroup,
    getCheckScope,
    postCheckScope
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    }),
    [changeCheckedKeys]: (state, {payload}) => ({
        ...state,
        checkedKeys: payload
    }),
    [getCheckGroupOK]: (state, {payload}) => ({
        ...state,
        checkGroupsData: payload
    })
}, {});
