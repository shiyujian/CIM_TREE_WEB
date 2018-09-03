import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';

import fieldFactory from '_platform/store/service/field';

export const ID = 'SYSTEM_USER';

const sidebarReducer = fieldFactory(ID, 'sidebar');
const additionReducer = fieldFactory(ID, 'addition');
const filterReducer = fieldFactory(ID, 'filter');

export const actions = {
    ...sidebarReducer,
    ...additionReducer,
    ...filterReducer
};

export default handleActions(
    {
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
