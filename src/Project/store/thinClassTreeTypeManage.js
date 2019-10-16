import {createAction, handleActions} from 'redux-actions';
import {
    ROUTE_API,
    TREE_API,
    SYSTEM_API
} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases`); // 获取苗圃列表
export const getThinClass = forestFetchAction(`${ROUTE_API}/thinclasses`); // 查询分块细班数据
export const getDistinctThinClasses = forestFetchAction(`${ROUTE_API}/distinctthinclasses`); // 查询唯一性细班数据
export const getDataimports = forestFetchAction(`${ROUTE_API}/dataimports`); // 批量导入记录查询
export const deleteDataimport = forestFetchAction(`${ROUTE_API}/dataimport/{{id}}`, [], 'DELETE'); // 批量导入记录删除
export const getThinClassPlans = forestFetchAction(`${ROUTE_API}/thinclassplans`); // 获取细班栽植计划分项
export const postThinClassPlans = forestFetchAction(`${ROUTE_API}/thinclassplan`, [], 'POST'); // 增加细班栽植计划分项
export const putThinClassPlans = createFetchAction(`${ROUTE_API}/thinclassplan`, [], 'PUT'); // 更新细班栽植计划分项
export const deleteThinClassPlans = createFetchAction(`${ROUTE_API}/thinclassplan/{{ID}}`, [], 'DELETE'); // 更新细班栽植计划分项
export const getTreeTypes = forestFetchAction(`${TREE_API}/treetypes`); // 获取所有树种类型
export const postThinclass = forestFetchAction(`${ROUTE_API}/thinclass`, [], 'POST'); // 细班更新

export const actions = {
    getNurseryList,
    getThinClass,
    getDistinctThinClasses,
    getDataimports,
    deleteDataimport,
    getThinClassPlans,
    postThinClassPlans,
    putThinClassPlans,
    deleteThinClassPlans,
    getTreeTypes,
    postThinclass
};

export default handleActions({
}, {});
