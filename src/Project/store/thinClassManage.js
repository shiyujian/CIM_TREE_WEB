import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃列表
export const getThinClass = forestFetchAction(`${FOREST_API}/route/thinclasses`); // 查询细班数据

export const actions = {
    getNurseryList,
    getThinClass
};

export default handleActions({
}, {});
