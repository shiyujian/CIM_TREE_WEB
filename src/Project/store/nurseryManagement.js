import {createAction, handleActions} from 'redux-actions';
import {
    UPLOAD_API,
    SYSTEM_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';

export const ID = 'nurserymanagement';
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases`, [], 'GET', [getNurseryListOK]); // 获取苗圃列表
export const postNursery = forestFetchAction(`${SYSTEM_API}/nurserybase`, [], 'POST'); // 新建苗圃
export const putNursery = forestFetchAction(`${SYSTEM_API}/nurserybase`, [], 'PUT'); // 编辑苗圃
export const deleteNursery = forestFetchAction(`${SYSTEM_API}/nurserybase/{{ID}}`, [], 'DELETE'); // 删除苗圃
export const checkNursery = forestFetchAction(`${SYSTEM_API}/checknurserybase`, [], 'post'); // 苗圃审核
export const getNb2ss = forestFetchAction(`${SYSTEM_API}/nb2ss`, [], 'GET'); // 获取苗圃基地供应商的绑定关系

export const getSupplierList = forestFetchAction(`${SYSTEM_API}/suppliers`, [], 'GET'); // 获取供应商列表

export const getRegionCodes = forestFetchAction(`${SYSTEM_API}/regioncodes`, [], 'GET'); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${UPLOAD_API}?filetype=org`, [], 'POST');
export const postNurseryBlack = forestFetchAction(`${SYSTEM_API}/blacknurserybase`, [], 'POST'); // 苗圃拉黑

export const actions = {
    getNurseryListOK,
    getNurseryList,
    postNursery,
    putNursery,
    deleteNursery,
    checkNursery,
    getNb2ss,
    getSupplierList,
    getRegionCodes,
    changeEditVisible,
    postUploadImage,
    postNurseryBlack
};

export default handleActions({
    [getNurseryListOK]: (state, {payload}) => ({
        ...state,
        nurseryList: payload
    }),
    [changeEditVisible]: (state, {payload}) => ({
        ...state,
        editVisible: payload
    })
}, {});
