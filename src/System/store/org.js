import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API } from '_platform/api';

import fieldFactory from '_platform/store/service/field';

export const ID = 'SYSTEM_ORG';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
export const getListStore = createAction(`${ID}getListStore`);
export const changeOrgTreeDataStatus = createAction(`${ID}changeOrgTreeDataStatus`);
const addDir = createFetchAction(`${SERVICE_API}/directories/`, 'POST');
// 编辑人员Visible
export const changeEditOrgVisible = createAction(`${ID}编辑组织机构Visible`);
export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    getListStore,
    changeOrgTreeDataStatus,
    addDir,
    changeEditOrgVisible
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
    }),
    [changeEditOrgVisible]: (state, {payload}) => ({
        ...state,
        editOrgVisible: payload
    })
}, {});
