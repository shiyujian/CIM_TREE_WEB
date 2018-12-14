import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './fetchAction';

import {
    FOREST_API, SEEDLING_API, SERVICE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'Market_supermarket_seedlingPurchase';
// 示例action
// 苗木养护查询
export const getCuring = forestFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getWpunittree = forestFetchAction(`${FOREST_API}/tree/wpunittree`); // 获得所有项目
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=mall`, [], 'POST'); // 上传图片


export const getPurchaseList = createFetchAction(`${SEEDLING_API}/purchase/purchases`); // 采购单列表
export const getPurchaseById = createFetchAction(`${SEEDLING_API}/purchase/purchase/{{id}}`); // 根据ID采购单详情
export const getOfferInventoryById = createFetchAction(`${SEEDLING_API}/purchase/offers`); // 根据ID获取采购报价清单
export const postOffer = createFetchAction(`${SEEDLING_API}/purchase/offer`, [], 'POST'); // 采购报价
export const getOrgTree_new = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`); // 根据pk获取组织机构


// 修改选择地图的方式
export const changePurchaseDetailsVisible = createAction(`${ID}_changePurchaseDetailsVisible`);
export const changePurchaseDetailsKey = createAction(`${ID}_changePurchaseDetailsKey`);

export const actions = {
    getCuring,
    getPurchaseList,
    getWpunittree,
    getPurchaseById,
    getOfferInventoryById,
    postOffer,
    getOrgTree_new,
    postUploadImage,
    changePurchaseDetailsVisible,
    changePurchaseDetailsKey
};
export default handleActions({
    [changePurchaseDetailsVisible]: (state, {payload}) => ({
        ...state,
        purchaseDetailsVisible: payload
    }),
    [changePurchaseDetailsKey]: (state, {payload}) => ({
        ...state,
        purchaseDetailsKey: payload
    })
}, {});
