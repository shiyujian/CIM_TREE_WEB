import { handleActions, combineActions, createAction } from 'redux-actions';
import {
    TREE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import createFetchAction from 'fetch-action';
export const ID = 'PROJECT_CONSTRUCTIONPACKAGE';
// 批量导入施工包
const postAddWpunits = forestFetchAction(`${TREE_API}/wpunits`, [], 'POST');
// 删除施工包
export const deleteWpunit = createFetchAction(`${TREE_API}/wpunit`, [], 'DELETE');
// 设置页面loading
export const setConstructionPackageLoading = createAction(`${ID}_setConstructionPackageLoading`);
export const actions = {
    setConstructionPackageLoading,
    postAddWpunits,
    deleteWpunit
};

export default handleActions(
    {
        [setConstructionPackageLoading]: (state, {payload}) => {
            return {
                ...state,
                constructionPackageLoading: payload
            };
        }
    },
    {}
);
