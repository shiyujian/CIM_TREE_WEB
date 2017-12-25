import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, USER_API, WORKFLOW_API } from '_platform/api';

const ID = 'SAFETYSPECIAL';
export const ModalVisible = createAction(`${USER_API}组织Modal模态框显示隐藏`);

export const getAllUsers = createFetchAction(`${USER_API}/users/`, []);
export const getProjects = createFetchAction(`${USER_API}/project-tree/?depth=1`);

export const ShowTable = createAction(`${ID}_获取导入数据`);
export const ChangeRow = createAction(`${ID}_申请变更数据`);
export const DeleteRow = createAction(`${ID}_申请删除数据`);

//文档目录树相关
const getScheduleDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`,[],'GET');
const postScheduleDir = createFetchAction(`${SERVICE_API}/directories/`,[],'POST');

// 查询
const getSearcherDir = createFetchAction(`${SERVICE_API}/searcher/?keyword={{code}}&&obj_type=C_DOC`,[],'GET');



export const actions = {
	ModalVisible,
	getAllUsers,
	getProjects,
	ShowTable,
	ChangeRow,
	DeleteRow,
	getScheduleDir,
	postScheduleDir,
	getSearcherDir,
};

export default handleActions({
	[ModalVisible]: (state, { payload }) => ({
		...state,
		visible: payload,
	}),
	[ShowTable]: (state, { payload }) => ({
		...state,
		dataSource: payload,
	}),
	[ChangeRow]: (state, { payload }) => ({
		...state,
		changeInfo: payload,
	}),
	[DeleteRow]: (state, { payload }) => ({
		...state,
		deleteInfo: payload,
	}),
}, {});
