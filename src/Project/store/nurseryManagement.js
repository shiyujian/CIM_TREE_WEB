import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';

export const ID = 'nurserymanagement';
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`, [], 'GET', [getNurseryListOK]); // 获取苗圃列表
export const postNursery = forestFetchAction(`${FOREST_API}/system/nurserybase`, [], 'POST'); // 新建苗圃
export const putNursery = forestFetchAction(`${FOREST_API}/system/nurserybase`, [], 'PUT'); // 编辑苗圃
export const deleteNursery = forestFetchAction(`${FOREST_API}/system/nurserybase/{{ID}}`, [], 'DELETE'); // 删除苗圃
export const checkNursery = forestFetchAction(`${FOREST_API}/system/checknurserybase`, [], 'post'); // 苗圃审核
export const getNb2ss = forestFetchAction(`${FOREST_API}/system/nb2ss`, [], 'GET'); // 获取苗圃基地供应商的绑定关系

export const getSupplierList = forestFetchAction(`${FOREST_API}/system/suppliers`, [], 'GET'); // 获取供应商列表

export const getRegionCodes = forestFetchAction(`${FOREST_API}/system/regioncodes`, [], 'GET'); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=org`, [], 'POST');

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
    postUploadImage
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
