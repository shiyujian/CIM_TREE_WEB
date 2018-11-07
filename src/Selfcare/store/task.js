import { combineActions, handleActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import createFetchAction from 'fetch-action';
import {
    WORKFLOW_API,
    FOREST_API
} from '_platform/api';
const ID = 'SELFCARE_TASK';
const parameterReducer = fieldFactory(ID, 'parameter');

export const setTaskDetailLoading = createAction(
    `${ID}_设置任务详情loading的值`
);
// 更改某个state的deadline
export const patchDeadline = createFetchAction(
    `${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`,
    [],
    'PATCH'
);
// 更改流程中存储的subject数据
export const postSubject = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/subject/`,
    [],
    'POST'
);
// 查看流程详情
export const getWorkflowById = createFetchAction(
    `${WORKFLOW_API}/instance/{{pk}}/`,
    [],
    'GET'
);
// 日进度存储
export const addSchedule = createFetchAction(
    `${FOREST_API}/tree/progress`,
    [],
    'post'
);
export const gettreetype = createFetchAction(
    `${FOREST_API}/tree/treetypesbyno`,
    []
);

const changeDocs = createAction(`${ID}_22CHANGE_DOCS`);
const selectDocuments = createAction(`${ID}_22SELECTDOUMENT`);

export const actions = {
    ...parameterReducer,
    setTaskDetailLoading,
    patchDeadline,
    postSubject,
    getWorkflowById,
    addSchedule,
    changeDocs,
    selectDocuments,
    gettreetype
};

export default handleActions(
    {
        [setTaskDetailLoading]: (state, { payload }) => ({
            ...state,
            detailLoading: payload
        }),
        [changeDocs]: (state, { payload }) => ({
            ...state,
            docs: payload
        }),
        [selectDocuments]: (state, { payload }) => ({
            ...state,
            selected: payload
        }),
        [combineActions(...actionsMap(parameterReducer))]: (state, action) => ({
            ...state,
            parameter: parameterReducer(state.parameter, action)
        })
    },
    {}
);
