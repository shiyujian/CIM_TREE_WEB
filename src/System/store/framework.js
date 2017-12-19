import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API} from '_platform/api';
import {getFieldValue} from '_platform/store/util';







/**
 * 新建交互取值
 */
export const resetAllParam = createAction('重制参数竣工文件');
export const fillItemParam = createAction('填充一条记录的参数竣工文件');
export const changeBasicParam = createAction('填写基础属性参数竣工文件', (key, event) => ({[key]: getFieldValue(event)}));
export const changeExtraParam = createAction('填写扩展属性参数竣工文件', (key, event) => ({[key]: getFieldValue(event)}));

const params = handleActions({
	[resetAllParam]: () => ({}),
	[fillItemParam]: (state, {payload}) => {
		const {name, code, ...extra_params} = payload;
		return {
			name,
			code,
			...extra_params,
			isEditing: true
		}
	},
	[changeBasicParam]: (state, {payload}) => {
		return {
			...state,
			...payload
		}
	},
	[changeExtraParam]: (state, {payload}) => {
		const extra_params = state.extra_params;
		return {
			...state,
			extra_params: {
				...extra_params,
				...payload
			},
		}
	}
}, {});

export const toggleFrameworkAdditionVisible = createAction('显示隐藏新建组织机构');




//获取组织机构树
export const getFrameworkTreeOK = createAction('获取组织机构树');
export const getFrameworkTree = createFetchAction(`${SERVICE_API}/org-tree/`, [getFrameworkTreeOK]);
//获取组织机构table列表
export const getFrameworkListOK = createAction('获取组织机构列表');
export const getFrameworkList = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`, [getFrameworkListOK]);
//删除组织机构
export const deleteFramework = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/?this=true`, [], 'DELETE');
//设置当前选中的节点
export const setCurrentFrameworkNode = createAction('设置当前的政策法规节点竣工文件');
//新增组织机构
export const postFramework = createFetchAction(`${SERVICE_API}/orgs/`, [], 'POST');
//编辑组织机构
export const putFramework = createFetchAction(`${SERVICE_API}/orgs/code/{{code}}/`, [], 'PUT');
//获取人员列表
export const getPersons = createFetchAction(`${SERVICE_API}/orglist/?key_type=code&members=true&list={{codes}}/`, []);

export default handleActions({
	[getFrameworkTreeOK]: (state, {payload}) => {
		return {
			...state,
			orgTrees: payload.children
			// orgTrees: [payload]
		}
	},
	[getFrameworkListOK]: (state, {payload}) => {
		return {
			...state,
			orgLists: [payload]
		}
	},
	[setCurrentFrameworkNode]: (state, {payload}) => {
		return {
			...state,
			currentFrameworkNode:{
				pk:payload.pk,
				code:payload.code,
				relation:payload.relation,
			}
		}
	},
	[combineActions(resetAllParam, fillItemParam, changeBasicParam, changeExtraParam)]: (state, action) => {
		return {
			...state,
			params: params(state.params, action)
		}
	},
	[toggleFrameworkAdditionVisible]: (state, action) => {
		return {
			...state,
			additionModalVisible: action.payload
		}
	},
}, {});
