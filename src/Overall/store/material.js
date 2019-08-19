import {createAction, handleActions, combineActions} from 'redux-actions';

const ID = 'material';

export const setTabActive = createAction(`${ID}设置当前选中的tab`);
export const actions = {
    setTabActive
};

export default handleActions({
    [setTabActive]: (state, {payload}) => ({
        ...state,
        tabValue: payload
    })
}, {});
