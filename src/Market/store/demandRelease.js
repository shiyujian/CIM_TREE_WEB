import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    FOREST_API
} from '_platform/api';

export const ID = 'Market_supermarket_demandRelease';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 修改选择地图的方式
export const changeAddDemandModalVisible = createAction(`${ID}_changeAddDemandModalVisible`);

export const actions = {
    getCuring,
    changeAddDemandModalVisible
};
export default handleActions({
    [changeAddDemandModalVisible]: (state, {payload}) => ({
        ...state,
        addDemandModalVisible: payload
    })
}, {});
