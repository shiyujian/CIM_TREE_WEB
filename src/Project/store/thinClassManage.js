import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃列表
export const getThinClass = forestFetchAction(`${FOREST_API}/route/thinclasses`); // 查询细班数据
export const getDataimports = forestFetchAction(`${FOREST_API}/route/dataimports`); // 批量导入记录查询
export const deleteDataimport = forestFetchAction(`${FOREST_API}/route/dataimport/{{id}}`, [], 'DELETE'); // 批量导入记录删除
export const getThinClassPlans = forestFetchAction(`${FOREST_API}/route/thinclassplans`); // 获取细班栽植计划分项
export const postThinClassPlans = forestFetchAction(`${FOREST_API}/route/thinclassplan`, [], 'POST'); // 获取细班栽植计划分项
export const putThinClassPlans = forestFetchAction(`${FOREST_API}/route/thinclassplan`, [], 'PUT'); // 获取细班栽植计划分项
export const getTreeTypes = forestFetchAction(`${FOREST_API}/tree/treetypes`); // 获取所有树种类型

export const actions = {
    getNurseryList,
    getThinClass,
    getDataimports,
    deleteDataimport,
    getThinClassPlans,
    postThinClassPlans,
    putThinClassPlans,
    getTreeTypes
};

export default handleActions({
}, {});
