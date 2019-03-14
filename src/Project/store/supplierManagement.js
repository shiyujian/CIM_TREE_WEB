import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃列表

export const getSupplierList = forestFetchAction(`${FOREST_API}/system/suppliers`); // 获取供应商列表
export const postSupplier = forestFetchAction(`${FOREST_API}/system/supplier`, [], 'POST'); // 新建供应商
export const putSupplier = forestFetchAction(`${FOREST_API}/system/supplier`, [], 'PUT'); // 编辑供应商
export const deleteSupplier = forestFetchAction(`${FOREST_API}/system/supplier/{{ID}}`, [], 'DELETE'); // 删除供应商
export const checkSupplier = forestFetchAction(`${FOREST_API}/system/checksupplier`, [], 'post'); // 供应商审核
export const getNb2ss = forestFetchAction(`${FOREST_API}/system/nb2ss`); // 获取苗圃基地供应商的绑定关系

export const getRegionCodes = forestFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=org`, [], 'POST');
export const postSupplierBlack = forestFetchAction(`${FOREST_API}/system/blacksupplier`, [], 'POST'); // 供应商拉黑

export const actions = {
    getNurseryList,
    getSupplierList,
    postSupplier,
    putSupplier,
    deleteSupplier,
    checkSupplier,
    getNb2ss,
    getRegionCodes,
    changeEditVisible,
    postUploadImage,
    postSupplierBlack
};

export default handleActions({
    [changeEditVisible]: (state, {payload}) => ({
        ...state,
        editVisible: payload
    })
}, {});
