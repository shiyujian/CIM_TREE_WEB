// import { handleActions, combineActions } from 'redux-actions';
// import { actionsMap } from '_platform/store/util';
// import taskcreateReducer, { actions as taskcreateActions } from './taskcreate';
// import taskreportReducer, { actions as taskreportActions } from './taskreport';
// import taskstatisReducer, { actions as taskstatisActions } from './taskstatis';
// export default handleActions(
//     {
//         [combineActions(...actionsMap(taskcreateActions))]: (state = {}, action) => {
//             return {
//                 ...state,
//                 taskcreate: taskcreateReducer(state.taskcreate, action)
//             };
//         },
//         [combineActions(...actionsMap(taskreportActions))]: (state = {}, action) => {
//             return {
//                 ...state,
//                 taskreport: taskreportReducer(state.taskreport, action)
//             };
//         },
//         [combineActions(...actionsMap(taskstatisActions))]: (state = {}, action) => {
//             return {
//                 ...state,
//                 taskstatis: taskstatisReducer(state.taskstatis, action)
//             };
//         }
//     },
//     {}
// );

import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    SERVICE_API,
    base,
    USER_API,
    WORKFLOW_API,
    FOREST_API
} from '_platform/api';
const ID = 'Forest_curing';

export const getTreearea = createFetchAction(
    `${FOREST_API}/route/thinclasses?`
);
export const getUsers = createFetchAction(`${USER_API}/users/`, []);

export const getTreeNodeList = createFetchAction(
    `${FOREST_API}/tree/wpunittree`,
    []
); //    √
export const getLittleBan = createFetchAction(
    `${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`,
    []
); //

// 创建文档目录
export const postDocDir = createFetchAction(`${SERVICE_API}/directories/`, [], 'POST');
// 创建文档目录
export const getDocDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?all=true`, [], 'GET');
// 删除文档目录
export const delDocDir = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`, [], 'DELETE');
// 查看文档
export const getDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [], 'GET');
// 删除文档
export const delDocument = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/?this=true`, [], 'DELETE');

export const getDocList = createFetchAction(`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [], 'GET');
// 创建文档
export const postDocument = createFetchAction(`${SERVICE_API}/documents/`, [], 'POST');

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
    postDocument
};
export default handleActions(
    {

    },
    {}
);
