import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API, SEEDLING_API
} from '_platform/api';

export const ID = 'Market_supermarket_seedlingSupply';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getSeedlingSupplyList = createFetchAction(`${SEEDLING_API}/good/goods`, [], 'GET'); // 苗木供应列表
export const getSeedlingSupplyById = createFetchAction(`${SEEDLING_API}/good/good/{id}}`); // 苗木商品详情
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);

export const actions = {
    getCuring,
    getSeedlingSupplyList,
    getSeedlingSupplyById
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    })
}, {});
