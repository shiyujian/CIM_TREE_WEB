import {createAction,handleActions,combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {FOREST_API} from '_platform/api';
import booleanFactory from '_platform/store/higher-order/bool';

export const ID = 'treemanage';
export const getTreeListOK = createAction(`${ID}_gettreeListlist`);
export const getTreeList =createFetchAction(`${FOREST_API}/tree/treetypes`, [getTreeListOK]);
export const postNursery =createFetchAction(`${FOREST_API}/tree/nurseryconfig`, [],'POST');
export const putNursery =createFetchAction(`${FOREST_API}/tree/nurseryconfig`, [],'PUT');
export const deleteNursery =createFetchAction(`${FOREST_API}/tree/nurseryconfig/{{ID}}`, [],'DELETE');
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);

export const actions = {
    getTreeListOK,
	getTreeList,
	postNursery,
	putNursery,
	deleteNursery,
	changeEditVisible
};

export default handleActions({
	[getTreeListOK]: (state, {payload}) => ({
		...state,
		treeList: payload
	}),
	[changeEditVisible]: (state, {payload}) => ({
		...state,
		editVisible: payload
	})
}, {});