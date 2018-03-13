import {createAction,handleActions,combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {FOREST_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'nurserymanagement';
export const getNurseryListOK = createAction(`${ID}_getnurseryListlist`);
export const getNurseryList =createFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [getNurseryListOK]);
export const postNursery =createFetchAction(`${FOREST_API}/tree/nurseryconfig`, [],'POST');
export const putNursery =createFetchAction(`${FOREST_API}/tree/nurseryconfig`, [],'PUT');
export const deleteNursery =createFetchAction(`${FOREST_API}/tree/nurseryconfig/{{ID}}`, [],'DELETE');
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);

export const actions = {
    getNurseryListOK,
	getNurseryList,
	postNursery,
	putNursery,
	deleteNursery,
	changeEditVisible
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