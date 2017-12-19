import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

const ID = 'SAFETYSPECIAL';

export const ShowTable = createAction(`${ID}_获取导入数据`);
export const ChangeRow = createAction(`${ID}_申请变更数据`);
export const DeleteRow = createAction(`${ID}_申请删除数据`);
export const actions = {
	ShowTable,
	ChangeRow,
	DeleteRow,
};

export default handleActions({
	[ShowTable]: (state, {payload}) => ({
		...state,
		dataSource:payload,
	}),
	[ChangeRow]: (state, {payload}) => ({
		...state,
		changeInfo:payload,
	}),
	[DeleteRow]: (state, {payload}) => ({
		...state,
		deleteInfo:payload,
	}),
}, {});
