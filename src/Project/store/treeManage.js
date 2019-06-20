import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';
import { createFetchActionWithHeaders as myFetch } from './fetchAction';

export const ID = 'treemanage';
export const getTreeTypeListOK = createAction(`${ID}_gettreeTypeListlist`);
export const getTreeTypeList = forestFetchAction(`${FOREST_API}/tree/treetypes`, [getTreeTypeListOK]);
export const postTreeType = forestFetchAction(`${FOREST_API}/tree/treetype`, [], 'POST');
export const putTreeType = forestFetchAction(`${FOREST_API}/tree/treetype`, [], 'PUT');
export const deleteTreeType = forestFetchAction(`${FOREST_API}/tree/treetype/{{ID}}`, [], 'DELETE');
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const changeViewVisible = createAction(`${ID}changeViewVisible`);
export const postForsetPic = myFetch(
    `${FOREST_API}/UploadHandler.ashx?filetype=treetype`,
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
