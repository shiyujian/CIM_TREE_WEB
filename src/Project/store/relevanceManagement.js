import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';

export const ID = 'nurserymanagement';
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`, [getNurseryListOK]); // 获取苗圃列表
export const getSupplierList = forestFetchAction(`${FOREST_API}/system/suppliers`); // 获取供应商列表
export const getNb2ss = forestFetchAction(`${FOREST_API}/system/nb2ss`); // 获取苗圃基地供应商的绑定关系
export const checknb2s = forestFetchAction(`${FOREST_API}/system/checknb2s`, [], 'POST'); // 苗圃基地供应商的绑定审核
export const putSupplier = forestFetchAction(`${FOREST_API}/system/supplier`, [], 'PUT'); // 编辑供应商
export const postNb22s = forestFetchAction(`${FOREST_API}/system/nb2s`, [], 'POST'); // 新增绑定关系
export const deleteNb22s = forestFetchAction(`${FOREST_API}/system/nb2s/{{ID}}`, [], 'DELETE'); // 删除绑定

export const getRegionCodes = forestFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=org`, [], 'POST');

export const actions = {
    getNurseryListOK,
    getNurseryList,
    getSupplierList,
    getNb2ss,
    checknb2s,
    putSupplier,
    getRegionCodes,
    changeEditVisible,
    postUploadImage,
    postNb22s,
    deleteNb22s
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
