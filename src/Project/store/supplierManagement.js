import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = createFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃列表

export const getSupplierList = createFetchAction(`${FOREST_API}/system/suppliers`); // 获取供应商列表
export const postSupplier = createFetchAction(`${FOREST_API}/system/supplier`, [], 'POST'); // 新建供应商
export const putSupplier = createFetchAction(`${FOREST_API}/system/supplier`, [], 'PUT'); // 编辑供应商
export const deleteSupplier = createFetchAction(`${FOREST_API}/system/supplier/{{ID}}`, [], 'DELETE'); // 删除供应商
export const checkSupplier = createFetchAction(`${FOREST_API}/system/checksupplier`, [], 'post'); // 供应商审核
export const getNb2ss = createFetchAction(`${FOREST_API}/system/nb2ss`); // 获取苗圃基地供应商的绑定关系

export const getRegionCodes = createFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=org`, [], 'POST');

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
	postUploadImage
};

export default handleActions({
	[changeEditVisible]: (state, {payload}) => ({
		...state,
		editVisible: payload
	})
}, {});
