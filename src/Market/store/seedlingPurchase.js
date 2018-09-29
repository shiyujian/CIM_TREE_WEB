import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API, SEEDLING_API, SERVICE_API
} from '_platform/api';

export const ID = 'Market_supermarket_seedlingPurchase';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getPurchaseList = createFetchAction(`${SEEDLING_API}/purchase/purchases`); // 采购单列表
export const getWpunittree = createFetchAction(`${FOREST_API}/tree/wpunittree`); // 获得所有项目
export const getPurchaseById = createFetchAction(`${SEEDLING_API}/purchase/purchase/{{id}}`); // 根据ID采购单详情
export const getOfferInventoryById = createFetchAction(`${SEEDLING_API}/purchase/offers`); // 根据ID获取采购报价清单
export const getOrgTree_new = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`); // 根据code获取组织机构

// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);

export const actions = {
    getCuring,
    getPurchaseList,
    getWpunittree,
    getPurchaseById,
    getOfferInventoryById,
    getOrgTree_new
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    })
}, {});
