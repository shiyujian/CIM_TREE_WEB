import {createAction, handleActions} from 'redux-actions';
import {
    UPLOAD_API,
    TREE_API
} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import { createFetchActionWithHeaders as myFetch } from './fetchAction';

export const ID = 'treemanage';
export const getTreeTypeListOK = createAction(`${ID}_gettreeTypeListlist`);
export const getTreeTypeList = forestFetchAction(`${TREE_API}/treetypes`, [getTreeTypeListOK]);
export const postTreeType = forestFetchAction(`${TREE_API}/treetype`, [], 'POST');
export const putTreeType = forestFetchAction(`${TREE_API}/treetype`, [], 'PUT');
export const deleteTreeType = forestFetchAction(`${TREE_API}/treetype/{{ID}}`, [], 'DELETE');
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const changeViewVisible = createAction(`${ID}changeViewVisible`);
export const postForsetPic = myFetch(
    `${UPLOAD_API}?filetype=treetype`,
    [],
    'POST'
);
// 是否新增或者修改树种状态
export const handleChangeTreeTypeStatus = createAction(`${ID}_changeTreeTypeStatus`);

export const actions = {
    getTreeTypeListOK,
    getTreeTypeList,
    postTreeType,
    putTreeType,
    deleteTreeType,
    changeEditVisible,
    changeViewVisible,
    postForsetPic,
    handleChangeTreeTypeStatus
};

export default handleActions({
    [getTreeTypeListOK]: (state, {payload}) => ({
        ...state,
        treeTypeList: payload
    }),
    [changeEditVisible]: (state, {payload}) => ({
        ...state,
        editVisible: payload
    }),
    [changeViewVisible]: (state, {payload}) => ({
        ...state,
        viewVisible: payload
    }),
    [handleChangeTreeTypeStatus]: (state, {payload}) => ({
        ...state,
        changeTreeTypeStatus: payload
    })
}, {});
