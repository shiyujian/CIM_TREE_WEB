import {createAction, handleActions} from 'redux-actions';
import {
    ROUTE_API,
    SYSTEM_API
} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases`); // 获取苗圃列表
export const getThinClass = forestFetchAction(`${ROUTE_API}/thinclasses`); // 查询细班数据
export const getDataimports = forestFetchAction(`${ROUTE_API}/dataimports`); // 批量导入记录查询
export const getLands = forestFetchAction(`${ROUTE_API}/lands`); // 获取所有地块
export const deleteDataimport = forestFetchAction(`${ROUTE_API}/dataimport/{{id}}`, [], 'DELETE'); // 批量导入记录删除

export const actions = {
    getNurseryList,
    getThinClass,
    getDataimports,
    getLands,
    deleteDataimport
};

export default handleActions({
}, {});
