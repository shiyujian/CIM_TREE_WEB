import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import { USER_API } from '_platform/api';
const getLoginUser = createFetchAction(
    `${USER_API}/users/{{id}}/`,
    [],
    'GET'
);
export const actions2 = {
    getLoginUser
};
export const ID = 'SYSTEM_PROJECT_PERMISSIONN';

const tableReducer = fieldFactory(ID, 'table');

export const actions = {
    ...tableReducer
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
