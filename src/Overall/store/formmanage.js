import { createAction, handleActions, combineActions } from 'redux-actions';

const ID = 'OVERALL_FORMMANAGE';
export const FormAddVisible = createAction(`${ID}表单管理新增显示和隐藏`);
export const actions = {
    FormAddVisible
};

export default handleActions({
    [FormAddVisible]: (state, { payload }) => ({
        ...state,
        formAddVisible: payload
    })
}, {});
