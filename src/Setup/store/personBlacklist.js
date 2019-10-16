import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {
    TREE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
export const ID = 'SYSTEM_personBlacklist';
// 苗圃信息
const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const getTags = forestFetchAction(`${TREE_API}/nurseryconfigs`, [
    getTagsOK
]);

export const setModifyPer = createAction('人员存储要变更的数据');

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    ...filterReducer,
    getTagsOK,
    getTags,
    setModifyPer
};

export default handleActions(
    {
        [getTagsOK]: (state, { payload }) => ({
            ...state,
            tags: payload
        }),
        [setModifyPer]: (state, { payload }) => ({
            ...state,
            modifyPer: payload
        }),
        [combineActions(...actionsMap(sidebarReducer))]: (state, action) => ({
            ...state,
            sidebar: sidebarReducer(state.sidebar, action)
        }),
        [combineActions(...actionsMap(filterReducer))]: (state, action) => ({
            ...state,
            filter: filterReducer(state.filter, action)
        }),
        [combineActions(...actionsMap(additionReducer))]: (state, action) => ({
            ...state,
            addition: additionReducer(state.addition, action)
        })
    },
    {}
);
