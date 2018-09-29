import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API, SEEDLING_API
} from '_platform/api';

export const ID = 'Market_supermarket_seedlingSupply';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getProductList = createFetchAction(`${SEEDLING_API}/good/goods`); // 获取商品列表
export const getProductById = createFetchAction(`${SEEDLING_API}/good/good/{{id}}`); // 根据ID苗木商品详情
export const getSpecsById = createFetchAction(`${SEEDLING_API}/good/specs`); // 根据ID获取规格
export const getInventoryList = createFetchAction(`${SEEDLING_API}/good/skus`); // 获取sku库存列表
export const getSupplierById = createFetchAction(`${FOREST_API}/system/supplier/{{id}}`); // 根据供应商id获取供应商信息

// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);

export const actions = {
    getCuring,
    getProductList,
    getProductById,
    getSpecsById,
    getInventoryList,
    getSupplierById
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    })
}, {});
