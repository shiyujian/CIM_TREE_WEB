import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SERVICE_API,
    FOREST_API,
    base
} from '_platform/api';
export const ID = 'Checkwork_attendancegroup';
// 示例action
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 修改选择地图的方式
export const changeSelectMap = createAction(`${ID}_changeSelectMap`);

export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);

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

//获取考情群体
export const getCheckGroup = createFetchAction(`${base}/main/api/check-group/`, [], 'GET');

//增加考勤群体
export const postCheckGroup = createFetchAction(`${base}/main/api/check-group/`, [], 'POST');


//删除考勤群体
export const deleteCheckGroup = createFetchAction(`${base}/main/api/check-group/{{id}}/`, [], 'DELETE');

//获取群体成员
export const getCheckGroupMans = createFetchAction(`${base}/main/api/group/{{id}}/members/`, [], 'GET');

// 将人员信息上传至redux
export const getCheckGroupMansOk = createAction(`${ID}_getCheckGroupMansOk`);

//增加群体成员
export const postCheckGroupMans = createFetchAction(`${base}/main/api/group/{{id}}/members/`, [], 'POST');

//增加群体成员
export const deleteCheckGroupMans = createFetchAction(`${base}/main/api/group/{{id}}/members/`, [], 'DELETE');



export const actions = {
    getCuring,
    getTreearea,
    delDocDir,
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
    deleteCuringGroupMan,
    getCheckGroup,
    postCheckGroup,
    deleteCheckGroup,
    getCheckGroupMans,
    postCheckGroupMans,
    getCheckGroupMansOk,
    deleteCheckGroupMans,
};
export default handleActions({
    [changeSelectMap]: (state, {payload}) => ({
        ...state,
        selectMap: payload
    }),
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
    }),
    [getCheckGroupMansOk]: (state, {payload}) => ({
        ...state,
        checkGroupMans: payload
    })
}, {});
