import { createAction, handleActions } from 'redux-actions';
const ID = 'DIPPING';

export const switchDashboardMenuType = createAction(`${ID}切换建设和运营菜单类型`);

export const actions = {
    switchDashboardMenuType
};
export default handleActions(
    {
        [switchDashboardMenuType]: (state, { payload }) => {
            return {
                ...state,
                dashboardMenuType: payload
            };
        }
    },
    {}
);
