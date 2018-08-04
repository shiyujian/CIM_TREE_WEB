import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    USER_API,
    FOREST_API
} from '_platform/api';

export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);
export const getRiskOK = createAction(`获取安全隐患`);
export const getRisk = createFetchAction(`${FOREST_API}/tree/patrolevents`, [getRiskOK]);
export const getTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, []); //    √
export const getLittleBan = createFetchAction(`${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`, []); //
export const getRiskContactSheet = createFetchAction(`${FOREST_API}/tree/patrolevent/{{ID}}`, []);
// 获取巡检路线
const getMapRouter = createFetchAction(`${FOREST_API}/tree/patrolroutes`, []);
// 获取轨迹列表
const getMapList = createFetchAction(`${FOREST_API}/tree/patrolpositions?routeid={{routeID}}`, []);
// 获取种植流程
export const getTreeflows = createFetchAction(`${FOREST_API}/tree/treeflows`, []);
// 获取苗圃信息
export const getNurserys = createFetchAction(`${FOREST_API}/tree/nurserys`, []);
// 获取打包车辆信息
export const getCarpackbysxm = createFetchAction(`${FOREST_API}/tree/carpackbysxm/{{sxm}}`, []);
// 获取树木现场种植的信息
export const getTreeMess = createFetchAction(`${FOREST_API}/tree/tree/{{sxm}}`, []);
export const getUserDetail = createFetchAction(`${USER_API}/users/{{pk}}`, []);
export const getTreeTypeAction = createFetchAction(`${FOREST_API}/tree/treetypes`, []);
// 苗木养护查询
export const getCuring = createFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
// 获获取养护类型
export const getcCuringTypes = createFetchAction(`${FOREST_API}/curing/curingtypes`, [], 'GET');
// 苗木养护计划详情
export const getCuringMessage = createFetchAction(`${FOREST_API}/curing/curing/{{id}}`, [], 'GET');
export const actions = {
    getTreearea,
    getRisk,
    getRiskOK,
    getRiskContactSheet,
    getTreeNodeList,
    getLittleBan,
    getMapRouter,
    getMapList,
    getTreeflows,
    getNurserys,
    getCarpackbysxm,
    getTreeMess,
    getUserDetail,
    getTreeTypeAction,
    getCuring,
    getcCuringTypes,
    getCuringMessage
};
export default handleActions(
    {
        [getRiskOK]: (state, { payload }) => {
            return {
                ...state,
                RiskLists: [payload]
            };
        }
    },
    {}
);
