import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './fetchAction';
import {
    FOREST_API, SEEDLING_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'Market_supermarket_supplyRelease';
// 示例action
// 苗木养护查询
export const getCuring = forestFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getTreeTypes = forestFetchAction(`${FOREST_API}/tree/treetypes`); // 获取苗木品种
export const getNurseryByPk = forestFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃基地列表
export const getBindingSupplier = forestFetchAction(`${FOREST_API}/system/nb2ss`); // 根据苗圃基地获取绑定的供应商
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=mall`, [], 'POST'); // 上传图片


export const postCommodity = createFetchAction(`${SEEDLING_API}/good/spu`, [], 'POST'); // 新增苗木商品
export const putCommodity = createFetchAction(`${SEEDLING_API}/good/spu`, [], 'PUT'); // 编辑苗木商品
export const deleteCommodity = createFetchAction(`${SEEDLING_API}/good/spu/{{id}}`, [], 'DELETE'); // 删除苗木商品
export const getProductList = createFetchAction(`${SEEDLING_API}/good/goods`); // 获取商品列表
export const getProductById = createFetchAction(`${SEEDLING_API}/good/good/{{id}}`); // 根据ID获取商品
export const getInventoryList = createFetchAction(`${SEEDLING_API}/good/skus`); // 获取sku库存列表
export const postInventory = createFetchAction(`${SEEDLING_API}/good/sku`, [], 'POST'); // 增加sku库存
export const putInventory = createFetchAction(`${SEEDLING_API}/good/sku`, [], 'PUT'); // 编辑sku库存
export const changeStatus = createFetchAction(`${SEEDLING_API}/good/changestatus`); // 商品上下架


// 修改选择地图的方式
export const changeAddSeedlingVisible = createAction(`${ID}_changeAddSeedlingVisible`);
export const changeAddSeedlingKey = createAction(`${ID}_changeAddSeedlingKey`);

export const actions = {
    getCuring,
    postCommodity,
    putCommodity,
    deleteCommodity,
    getTreeTypes,
    getNurseryByPk,
    postUploadImage,
    getProductList,
    getProductById,
    getBindingSupplier,
    getInventoryList,
    postInventory,
    putInventory,
    changeStatus,
    changeAddSeedlingVisible,
    changeAddSeedlingKey
};
export default handleActions({
    [changeAddSeedlingVisible]: (state, {payload}) => ({
        ...state,
        addSeedlingVisible: payload
    }),
    [changeAddSeedlingKey]: (state, {payload}) => ({
        ...state,
        addSeedlingKey: payload
    })
}, {});
