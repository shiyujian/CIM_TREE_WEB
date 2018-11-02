import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';

import fieldFactory from '_platform/store/service/field';

export const ID = 'SYSTEM_ORG';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
export const getListStore = createAction(`${ID}getListStore`);
export const changeOrgTreeDataStatus = createAction(`${ID}changeOrgTreeDataStatus`);

export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    getListStore,
    changeOrgTreeDataStatus
};

export default handleActions({
    [combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
        ...state,
        sidebar: sidebarReducer(state.sidebar, action)
    }),
    [combineActions(...actionsMap(additionReducer))]: (state, action) => ({
        ...state,
        addition: additionReducer(state.addition, action)
    }),
    [getListStore]: (state, {payload}) => ({
        ...state,
        listStore: payload
    }),
    [changeOrgTreeDataStatus]: (state, {payload}) => ({
        ...state,
        orgTreeDataChangeStatus: payload
    })
}, {});
