import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
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
