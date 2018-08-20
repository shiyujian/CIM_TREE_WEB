import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';

import {
    USER_API,
    FOREST_API
} from '_platform/api';
const ID = 'dashboard';
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

export const switchDashboardCompoment = createAction(`${ID}切换二维展示和工程影响`);
export const getAreaTree = createAction(`${ID}区域地块树`);
export const getRiskTree = createAction(`${ID}安全隐患树`);
export const getTrackTree = createAction(`${ID}巡检路线树`);
export const getTreetypesTree = createAction(`${ID}树种筛选树`);
export const getCuringTaskTree = createAction(`${ID}养护任务树`);
export const getSurvivalRateTree = createAction(`${ID}成活率树`);
export const getTotalThinClass = createAction(`${ID}获取所有的小班数据`);
export const getCuringTypes = createAction(`${ID}养护类型`);
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
    getCuringMessage,
    switchDashboardCompoment,
    getAreaTree,
    getRiskTree,
    getTrackTree,
    getTreetypesTree,
    getCuringTaskTree,
    getSurvivalRateTree,
    getTotalThinClass,
    getCuringTypes
};
export default handleActions(
    {
        [getRiskOK]: (state, { payload }) => {
            return {
                ...state,
                RiskLists: [payload]
            };
        },
        [switchDashboardCompoment]: (state, { payload }) => {
            return {
                ...state,
                dashboardCompomentMenu: payload
            };
        },
        [getAreaTree]: (state, { payload }) => {
            return {
                ...state,
                areaTree: payload
            };
        },
        [getRiskTree]: (state, { payload }) => {
            return {
                ...state,
                riskTree: payload
            };
        },
        [getTrackTree]: (state, { payload }) => {
            return {
                ...state,
                trackTree: payload
            };
        },
        [getTreetypesTree]: (state, { payload }) => {
            return {
                ...state,
                treetypesTree: payload
            };
        },
        [getCuringTaskTree]: (state, { payload }) => {
            return {
                ...state,
                curingTaskTree: payload
            };
        },
        [getSurvivalRateTree]: (state, { payload }) => {
            return {
                ...state,
                survivalRateTree: payload
            };
        },
        [getTotalThinClass]: (state, { payload }) => {
            return {
                ...state,
                totalThinClass: payload
            };
        },
        [getCuringTypes]: (state, { payload }) => {
            return {
                ...state,
                curingTypes: payload
            };
        }
    },
    {}
);
