import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import createFetchAction from 'fetch-action';
import fieldFactory from '_platform/store/service/field';
import {
    USER_API,
    FOREST_API
} from '_platform/api';
export const ID = 'SYSTEM_blacklist';
// 苗圃信息
const getTagsOK = createAction(`${ID}_GET_TAGS_OK`);
const getTags = createFetchAction(`${FOREST_API}/tree/nurseryconfigs`, [
    getTagsOK
]);

export const ModifyVisible = createAction('人员变更Modal显示隐藏');
export const setModifyPer = createAction('人员存储要变更的数据');

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');
const getPersonInfo = createFetchAction(
    `${USER_API}/users/?is_black={{is_black}}&page={{page}}`,
    [],
    'GET'
);

export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    ...filterReducer,
    getTagsOK,
    getTags,
    ModifyVisible,
    setModifyPer,
    getPersonInfo
};

export default handleActions(
    {
        [getTagsOK]: (state, { payload }) => ({
            ...state,
            tags: payload
        }),
        [ModifyVisible]: (state, { payload }) => ({
            ...state,
            Modvisible: payload
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
