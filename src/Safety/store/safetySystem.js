import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {base, SERVICE_API, FOREST_API} from '_platform/api';

export const ID = 'safetySystem';
export const AddVisible = createAction(`${ID}新增显示和隐藏`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);

export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]); //    √

export const actions = {
	AddVisible,
	getTree,
	getTreeOK,
};
export default handleActions({
	[AddVisible]: (state, {payload}) => ( {
		...state,
		addVisible: payload
	}),
	[getTreeOK]: (state, {payload}) => ( {
		...state,
		treeLists: payload
	}),
}, {});
