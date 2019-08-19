import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {SYSTEM_API} from '_platform/api';
export const ID = 'SYSTEM_PROJECT_PERMISSIONN';

const tableReducer = fieldFactory(ID, 'table');
// 获取系统中的全部权限
const getAllPermissions = createFetchAction(`${SYSTEM_API}/functions`, [], 'GET');
export const actions = {
    ...tableReducer,
    getAllPermissions
};

export default handleActions(
    {
        [combineActions(...actionsMap(tableReducer))]: (state, action) => ({
            ...state,
            table: tableReducer(state.table, action)
        })
    },
    {}
);
