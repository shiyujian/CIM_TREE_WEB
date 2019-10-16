import { handleActions, combineActions, createAction } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';

export const ID = 'SYSTEM_ROLE';

const memberReducer = fieldFactory(ID, 'member');
const additionReducer = fieldFactory(ID, 'addition');

export const actions = {
    ...memberReducer,
    ...additionReducer
};

export default handleActions(
    {
        [combineActions(...actionsMap(memberReducer))]: (state, action) => ({
            ...state,
            member: memberReducer(state.member, action)
        }),
        [combineActions(...actionsMap(additionReducer))]: (state, action) => ({
            ...state,
            addition: additionReducer(state.addition, action)
        })
    },
    {}
);
