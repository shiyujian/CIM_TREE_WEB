import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SYSTEM_API } from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import fieldFactory from '_platform/store/service/field';

export const ID = 'SYSTEM_ORG';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
export const getRegionCodes = forestFetchAction(`${SYSTEM_API}/regioncodes`, [], 'GET'); // 获取行政区划编码

// 编辑组织机构Visible
export const changeEditOrgVisible = createAction(`${ID}编辑组织机构Visible`);
// 添加项目Visible
export const changeAddProjectVisible = createAction(`${ID}添加项目Visible`);
// 编辑项目Visible
export const changeEditProjectVisible = createAction(`${ID}编辑项目Visible`);
// 获取项目
const getProjectList = createFetchAction(`${SYSTEM_API}/projects`, [], 'GET');
// 添加项目
const postAddProject = createFetchAction(`${SYSTEM_API}/project`, [], 'POST');
// 编辑项目
const putEditProject = createFetchAction(`${SYSTEM_API}/project`, [], 'PUT');
// 删除项目
const deleteProject = createFetchAction(`${SYSTEM_API}/project/{{ID}}`, [], 'DELETE');
export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    getRegionCodes,
    changeEditOrgVisible,
    changeAddProjectVisible,
    changeEditProjectVisible,
    getProjectList,
    postAddProject,
    putEditProject,
    deleteProject
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
    [changeEditOrgVisible]: (state, {payload}) => ({
        ...state,
        editOrgVisible: payload
    }),
    [changeAddProjectVisible]: (state, {payload}) => ({
        ...state,
        addProjectVisible: payload
    }),
    [changeEditProjectVisible]: (state, {payload}) => ({
        ...state,
        editProjectVisible: payload
    })
}, {});
