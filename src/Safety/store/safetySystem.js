import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {
    FOREST_API,
    WORKFLOW_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'safetySystem';
export const AddVisible = createAction(`${ID}新增显示和隐藏`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const getTree = forestFetchAction(`${FOREST_API}/tree/wpunits`, [
    getTreeOK
]); //    √
export const setkeycode = createAction(`${ID}_setkeycode`);

export const getWorkflowById = createFetchAction(
    `${WORKFLOW_API}/instance/{{id}}/`,
    [],
    'GET'
);

export const getWorkflowsOK = createAction(`${ID}搜索流程`);
export const getWorkflows = createFetchAction(
    `${WORKFLOW_API}/instance/?code={{code}}`,
    [getWorkflowsOK],
    'GET'
);
// 上传文件
const changeDocs = createAction(`${ID}_CHANGE_DOCS`);

export const SearchSafety = createAction(`${ID}安全体系是否重新获取流程`);

export const actions = {
    AddVisible,
    getTree,
    getTreeOK,
    setkeycode,
    changeDocs,
    getWorkflowById,
    getWorkflowsOK,
    getWorkflows,
    SearchSafety
};
export default handleActions(
    {
        [changeDocs]: (state, { payload }) => ({
            ...state,
            docs: payload
        }),
        [AddVisible]: (state, { payload }) => ({
            ...state,
            addVisible: payload
        }),
        [getTreeOK]: (state, { payload }) => ({
            ...state,
            treeLists: payload
        }),
        [setkeycode]: (state, { payload }) => ({
            ...state,
            keycode: payload
        }),
        [getWorkflowsOK]: (state, { payload }) => ({
            ...state,
            safetyTaskList: payload
        }),
        [SearchSafety]: (state, { payload }) => ({
            ...state,
            searchSafety: payload
        })
    },
    {}
);
