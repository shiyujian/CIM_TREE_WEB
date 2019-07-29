import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './dispatchFetchAction';
const ID = 'DISPATCH';
// Tab切换状态
export const setTabActive = createAction(`${ID}设置当前选中的tab`);

export const actions = {
    setTabActive
};

export default handleActions(
    {
        [setTabActive]: (state, { payload }) => ({
            ...state,
            tabValue: payload
        })
    },
    {}
);
