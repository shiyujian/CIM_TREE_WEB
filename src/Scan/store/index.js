import { createAction, handleActions } from 'redux-actions';
const ID = 'Scan';

export const switchScanMenuType = createAction(`${ID}切换建设和运营菜单类型`);

export const actions = {
    switchScanMenuType
};
export default handleActions(
    {
        [switchScanMenuType]: (state, { payload }) => {
            return {
                ...state,
                scanMenuType: payload
            };
        }
    },
    {}
);
