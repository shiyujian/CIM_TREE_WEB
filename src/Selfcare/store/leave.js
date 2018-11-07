import { createAction, handleActions } from 'redux-actions';

export const ModalVisible = createAction('请假申请的显示和隐藏');

export const actions = {
    ModalVisible
};
export default handleActions({
    [ModalVisible]: (state, { payload }) => ({
        ...state,
        visible: payload
    })
}, {});
