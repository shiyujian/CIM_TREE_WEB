import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';

export const ID = 'nurserymanagement';
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = createFetchAction(`${FOREST_API}/system/nurserybases`, [getNurseryListOK]); // 获取苗圃列表
export const getSupplierList = createFetchAction(`${FOREST_API}/system/suppliers`); // 获取供应商列表
export const getNb2ss = createFetchAction(`${FOREST_API}/system/nb2ss`); // 获取苗圃基地供应商的绑定关系
export const checknb2s = createFetchAction(`${FOREST_API}/system/checknb2s`); // 苗圃基地供应商的绑定审核

export const getRegionCodes = createFetchAction(`${FOREST_API}/system/regioncodes`); // 获取行政区划编码
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const postUploadImage = myFetch(`${FOREST_API}/UploadHandler.ashx?filetype=org`, [], 'POST');

export const actions = {
    getNurseryListOK,
	getNurseryList,
    getSupplierList,
	getNb2ss,
	checknb2s,
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
