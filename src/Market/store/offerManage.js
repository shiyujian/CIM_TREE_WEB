import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './fetchAction';
import {
    FOREST_API, SEEDLING_API, SERVICE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'Market_supermarket_supplyRelease';
// 示例action
// 苗木养护查询
export const getCuring = forestFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getWpunittree = forestFetchAction(`${FOREST_API}/tree/wpunittree`); // 获得所有项目
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=mall`, [], 'POST'); // 上传图片


export const getPurchaseList = createFetchAction(`${SEEDLING_API}/purchase/purchases`); // 获取采购列表
export const getPurchaseById = createFetchAction(`${SEEDLING_API}/purchase/purchase/{{id}}`); // 根据ID获取采购单
export const getPurchaseStandard = createFetchAction(`${SEEDLING_API}/purchase/specs`); // 获取采购单规格
export const getOffersById = createFetchAction(`${SEEDLING_API}/purchase/offers`); // 根据采购单ID获取采购报价清单
export const getOrgTree_new = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`); // 根据pk获取组织机构


// 修改选择地图的方式
export const changeOfferDetailsVisible = createAction(`${ID}_changeOfferDetailsVisible`);
export const changeOfferDetailsKey = createAction(`${ID}_changeOfferDetailsKey`);

export const actions = {
    getCuring,
    getPurchaseList,
    getPurchaseById,
    getPurchaseStandard,
    getOffersById,
    getWpunittree,
    getOrgTree_new,
    postUploadImage,
    changeOfferDetailsVisible,
    changeOfferDetailsKey
};
export default handleActions({
    [changeOfferDetailsVisible]: (state, {payload}) => {
        console.log(payload);
        return ({
            ...state,
            offerDetailsVisible: payload
        });
    },
    [changeOfferDetailsKey]: (state, {payload}) => ({
        ...state,
        offerDetailsKey: payload
    })
}, {});
