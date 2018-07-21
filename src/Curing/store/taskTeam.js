import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SERVICE_API,
    USER_API,
    FOREST_API
} from '_platform/api';

export const ID = 'Forest_curing_taskteam';
export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);
export const getUsers = createFetchAction(`${USER_API}/users/`, []);

export const getTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, []); //    √
export const getLittleBan = createFetchAction(`${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`, []); //

// 创建文档目录
export const postDocDir = createFetchAction(`${SERVICE_API}/directories/`, [], 'POST');
// 获取文档目录
export const getDocDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`, [], 'GET');
// 删除文档目录
export const delDocDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`, [], 'DELETE');
// 查看文档
export const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [], 'GET');
// 创建文档
export const postDocument = createFetchAction(`${SERVICE_API}/documents/`, [], 'POST');
// 删除文档
export const delDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, [], 'DELETE');
// 获取文档列表
export const getDocList = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [], 'GET');

// 修改关联用户Modal的visible
export const changeAddMemVisible = createAction(`${ID}_changeAddMemVisible`);
// 修改所选择标段，以查找人员
export const changeSelectSection = createAction(`${ID}_changeSelectSection`);
// 修改所选节点的状态
export const changeSelectState = createAction(`${ID}_changeSelectState`);
// 养护班组新增
export const postCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroup`, [], 'POST');
// 获取养护班组
export const getCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroups`, [], 'GET');
// 删除养护班组
export const deleteCuringGroup = createFetchAction(`${FOREST_API}/curing/curinggroup/{{ID}}`, [], 'DELETE');
// 修改所选择节点的班组
export const changeSelectMemTeam = createAction(`${ID}_changeSelectMemTeam`);
// 养护班组新增人员
export const postCuringGroupMan = createFetchAction(`${FOREST_API}/curing/curinggroupman`, [], 'POST');
// 将人员信息上传至redux
export const getCuringGroupMansOk = createAction(`${ID}_getCuringGroupMansOk`);
// 获取养护班组人员
export const getCuringGroupMans = createFetchAction(`${FOREST_API}/curing/curinggroupmans?groupid={{groupid}}`, [getCuringGroupMansOk], 'GET');
// 获取养护班组
export const deleteCuringGroupMan = createFetchAction(`${FOREST_API}/curing/curinggroupman/{{id}}`, [], 'DELETE');

export const actions = {
    getTreearea,
    getUsers,
    delDocDir,
    getTreeNodeList,
    getLittleBan,
    getDocList,
    postDocDir,
    getDocDir,
    getDocument,
    delDocument,
    postDocument,
    changeAddMemVisible,
    changeSelectSection,
    changeSelectMemTeam,
    changeSelectState,
    postCuringGroup,
    getCuringGroup,
    deleteCuringGroup,
    postCuringGroupMan,
    getCuringGroupMans,
    getCuringGroupMansOk,
    deleteCuringGroupMan
};
export default handleActions({
    [changeAddMemVisible]: (state, {payload}) => ({
        ...state,
        addMemVisible: payload
    }),
    [changeSelectSection]: (state, {payload}) => ({
        ...state,
        selectSection: payload
    }),
    [changeSelectMemTeam]: (state, {payload}) => ({
        ...state,
        selectMemTeam: payload
    }),
    [changeSelectState]: (state, {payload}) => ({
        ...state,
        selectState: payload
    }),
    [getCuringGroupMansOk]: (state, {payload}) => ({
        ...state,
        curingGroupMans: payload
    })
}, {});
