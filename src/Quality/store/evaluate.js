/**
 * Created by du on 2017/6/7.
 */
import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API, TREE_CODE} from '_platform/api';
export const ID = 'QUALITY_EVALUATE';

export const getTreeOK = createAction('${ID}_获取组织结构树');
export const getTree = createFetchAction(`${SERVICE_API}/project-tree/`, [getTreeOK]);

export const actions = {
	getTree,
	getTreeOK,
};

export default handleActions({
	[getTreeOK]: (state, {payload: {children}}) => ({
		...state,
		tree: children
	}),
}, {});