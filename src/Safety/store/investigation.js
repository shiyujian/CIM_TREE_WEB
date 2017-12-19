import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API} from '_platform/api';
import {SERVICE_API} from '_platform/api';

export const ID = 'INVESTIGATION';

//获取树
export const getTreeOK = createAction('${ID}_获取项目结构树')
export const getTree =
	createFetchAction(`${SERVICE_API}/project-tree/?depth=3`,[getTreeOK]);


export const actions = {
	getTreeOK,
	getTree
};

export default handleActions({
	[getTreeOK]: (state, {payload: {children}}) => ({
		...state,
		tree: children
	})
}, {});
