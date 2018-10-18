import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './fetchAction';
import {
    FOREST_API, SEEDLING_API
} from '_platform/api';

export const ID = 'Market_supermarket_supplyRelease';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getPurchaseList = createFetchAction(`${SEEDLING_API}/purchase/purchases`); // 获取采购列表
export const getPurchaseById = createFetchAction(`${SEEDLING_API}/purchase/purchase/{{id}}`); // 根据ID获取采购单
export const getPurchaseStandard = createFetchAction(`${SEEDLING_API}/purchase/specs`); // 获取采购单规格
export const getWpunittree = createFetchAction(`${FOREST_API}/tree/wpunittree`); // 获得所有项目

export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=mall`, [], 'POST'); // 上传图片

// 修改选择地图的方式
export const changeOfferDetailsVisible = createAction(`${ID}_changeOfferDetailsVisible`);
export const changeOfferDetailsKey = createAction(`${ID}_changeOfferDetailsKey`);

export const actions = {
    getCuring,
    getPurchaseList,
    getPurchaseById,
    getPurchaseStandard,
    getWpunittree,
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
