import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'volunteerManage';
export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeListOK = createAction(`${ID}_gettreeListlist`);
export const getTreeList = forestFetchAction(`${FOREST_API}/tree/treetypes`, [getTreeListOK]);
export const changeEditVisible = createAction(`${ID}_changeEditVisible`);
export const getVolunteertrees = forestFetchAction(`${FOREST_API}/tree/volunteertrees`); // 获取志愿者树木列表
export const postInitvolunteertree = forestFetchAction(`${FOREST_API}/tree/initvolunteertree`, [], 'POST'); // 志愿者造林初始化

export const actions = {
    getTreeListOK,
    getTreeList,
    changeEditVisible,
    getVolunteertrees,
    postInitvolunteertree,
    setkeycode
};

export default handleActions({
    [getTreeListOK]: (state, {payload}) => ({
        ...state,
        treetypes: payload
    }),
    [setkeycode]: (state, { payload }) => {
        return {
            ...state,
            keycode: payload
        };
    },
    [changeEditVisible]: (state, {payload}) => ({
        ...state,
        editVisible: payload
    })
}, {});
