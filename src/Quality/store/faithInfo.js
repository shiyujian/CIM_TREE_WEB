import {createAction, handleActions} from 'redux-actions';

export const changeModal1 = createAction('改变Modal的显示隐藏');

export const actions = {
    changeModal1
};
export default handleActions({
    [changeModal1]: (state, {payload}) => ({
        ...state,
        visibleModal: payload
    })
}, {});
