import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {capitalize} from '../util';
import {SERVICE_API} from '../../api';

export default (ID, service = '') => {
	const suffix = service.toUpperCase();
	service = capitalize(service);
	const getRootDirOK = createAction(`${ID}_GET_ROOT_DIR_OK_${suffix}`);
	const getRootDir = createFetchAction(
		`${SERVICE_API}/dir-tree/`, [getRootDirOK]);
	const getDirOK = createAction(`${ID}_GET_DIR_OK_${suffix}`);
	const getDir = createFetchAction(`${SERVICE_API}/dir-tree/code/{{code}}/?depth=7`, [getDirOK]);
	const setCurrentCategory = createAction(`${ID}_SET_CURRENT_CATEGORY_${suffix}`);
	const setCurrentNode = createAction(`${ID}_SET_CURRENT_NODE_${suffix}`);
	const dirReducer = handleActions({
		[getRootDirOK]: (state = [], {payload: {children = []}}) => {
			const [
				{children: [spec = {}]} = {},
				{children: catalogues = []},
			] = children;
			const categories = [spec, ...catalogues];
			return ({...state, categories: categories});
		},
		[getDirOK]: (state = [], {payload: {children = []}}) => {
			return ({...state, list: children});
		},
		[setCurrentNode]: (state, {payload}) => ({...state, current: payload}),
		[setCurrentCategory]: (state, {payload}) => ({
			...state,
			currentCategory: payload,
		}),
	}, {});

	dirReducer.getRootDirOK = getRootDirOK;
	dirReducer.getRootDir = getRootDir;
	dirReducer.getDirOK = getDirOK;
	dirReducer.getDir = getDir;
	dirReducer.setCurrentNode = setCurrentNode;
	dirReducer.setCurrentCategory = setCurrentCategory;
	return dirReducer;
};
