import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {FOREST_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';

export const ID = 'nurserymanagement';
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = createFetchAction(`${FOREST_API}/system/nurserybases`, [getNurseryListOK]); // 获取苗圃列表
export const postNursery = createFetchAction(`${FOREST_API}/system/nurserybase`, [], 'POST'); // 新建苗圃
export const putNursery = createFetchAction(`${FOREST_API}/system/nurserybase`, [], 'PUT'); // 编辑苗圃
export const deleteNursery = createFetchAction(`${FOREST_API}/system/nurserybase/{{ID}}`, [], 'DELETE'); // 删除苗圃
export const checkNursery = createFetchAction(`${FOREST_API}/system/checknurserybase`, [], 'post'); // 苗圃审核

export const getSupplierList = createFetchAction(`${FOREST_API}/system/suppliers`); // 获取供应商列表
export const postSupplier = createFetchAction(`${FOREST_API}/system/supplier`, [], 'POST'); // 新建供应商
export const putSupplier = createFetchAction(`${FOREST_API}/system/supplier`, [], 'PUT'); // 编辑供应商
export const deleteSupplier = createFetchAction(`${FOREST_API}/system/supplier/{{ID}}`, [], 'DELETE'); // 删除供应商
export const checkSupplier = createFetchAction(`${FOREST_API}/system/checksupplier`, [], 'post'); // 供应商审核

export const getRegionCodes = createFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=org`, [], 'POST');

export const actions = {
    getNurseryListOK,
	getNurseryList,
	postNursery,
	putNursery,
	deleteNursery,
	checkNursery,
	getSupplierList,
	postSupplier,
	putSupplier,
	deleteSupplier,
	checkSupplier,
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
