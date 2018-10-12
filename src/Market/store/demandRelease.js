import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API, SEEDLING_API, SERVICE_API
} from '_platform/api';

export const ID = 'Market_supermarket_demandRelease';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getNurseryByPk = createFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃基地列表
export const getPurchaseList = createFetchAction(`${SEEDLING_API}/purchase/purchases`); // 获取采购列表
export const getPurchaseById = createFetchAction(`${SEEDLING_API}/purchase/purchase/{{id}}`); // 根据ID获取采购单
export const postPurchase = createFetchAction(`${SEEDLING_API}/purchase/purchase`, [], 'POST'); // 增加采购单
export const putPurchase = createFetchAction(`${SEEDLING_API}/purchase/purchase`, [], 'PUT'); // 编辑采购单
export const deletePurchase = createFetchAction(`${SEEDLING_API}/purchase/purchase/{{id}}`, [], 'DELETE'); // 编辑采购单
export const changeStatus = createFetchAction(`${SEEDLING_API}/purchase/changestatus`); // 采购单状态变更
export const getPurchaseStandard = createFetchAction(`${SEEDLING_API}/purchase/specs`); // 获取采购单规格
export const postPurchaseStandard = createFetchAction(`${SEEDLING_API}/purchase/spec`, [], 'POST'); // 增加采购单规格
export const putPurchaseStandard = createFetchAction(`${SEEDLING_API}/purchase/spec`, [], 'PUT'); // 采购单规格变更
export const getWpunittree = createFetchAction(`${FOREST_API}/tree/wpunittree`); // 获得所有项目
export const getRegionCodes = createFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码
export const getTreeTypes = createFetchAction(`${FOREST_API}/tree/treetypes`); // 获取苗木品种
export const getOrgTree_new = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`); // 根据code获取组织机构

// 修改选择地图的方式
export const changeAddDemandVisible = createAction(`${ID}_changeAddDemandVisible`);
export const changeAddDemandKey = createAction(`${ID}_changeAddDemandKey`);

export const actions = {
    getCuring,
    getPurchaseList,
    getPurchaseById,
    postPurchase,
    putPurchase,
    deletePurchase,
    changeStatus,
    getPurchaseStandard,
    postPurchaseStandard,
    putPurchaseStandard,
    getWpunittree,
    getRegionCodes,
    getTreeTypes,
    getOrgTree_new,
    changeAddDemandVisible,
    changeAddDemandKey
};
export default handleActions({
    [changeAddDemandVisible]: (state, {payload}) => ({
        ...state,
        addDemandVisible: payload
    }),
    [changeAddDemandKey]: (state, {payload}) => ({
        ...state,
        addDemandKey: payload
    })
}, {});
