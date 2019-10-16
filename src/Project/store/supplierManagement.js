import {createAction, handleActions} from 'redux-actions';
import {
    UPLOAD_API,
    SYSTEM_API
} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases`); // 获取苗圃列表

export const getSupplierList = forestFetchAction(`${SYSTEM_API}/suppliers`); // 获取供应商列表
export const postSupplier = forestFetchAction(`${SYSTEM_API}/supplier`, [], 'POST'); // 新建供应商
export const putSupplier = forestFetchAction(`${SYSTEM_API}/supplier`, [], 'PUT'); // 编辑供应商
export const deleteSupplier = forestFetchAction(`${SYSTEM_API}/supplier/{{ID}}`, [], 'DELETE'); // 删除供应商
export const checkSupplier = forestFetchAction(`${SYSTEM_API}/checksupplier`, [], 'post'); // 供应商审核
export const getNb2ss = forestFetchAction(`${SYSTEM_API}/nb2ss`); // 获取苗圃基地供应商的绑定关系

export const getRegionCodes = forestFetchAction(`${SYSTEM_API}/regioncodes`); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${UPLOAD_API}?filetype=org`, [], 'POST');
export const postSupplierBlack = forestFetchAction(`${SYSTEM_API}/blacksupplier`, [], 'POST'); // 供应商拉黑

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
