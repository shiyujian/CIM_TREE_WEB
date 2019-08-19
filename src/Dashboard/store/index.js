import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import {
    USER_API,
    FOREST_API,
    LBSAMAP_API,
    TREEPIPE_API
} from '_platform/api';
const ID = 'dashboard';
// 获取隐患列表
export const getRisk = forestFetchAction(`${FOREST_API}/tree/patrolevents`, []);
// 获取隐患详情
export const getRiskContactSheet = forestFetchAction(`${FOREST_API}/tree/patrolevent/{{ID}}`, []);
// 获取巡检路线
export const getInspectRouter = forestFetchAction(`${FOREST_API}/tree/patrolroutes`, [], 'GET');
// 获取轨迹列表
export const getMapList = forestFetchAction(`${FOREST_API}/tree/patrolpositions?routeid={{routeID}}`, []);
// 获取种植流程
export const getTreeflows = forestFetchAction(`${FOREST_API}/tree/treeflows`, []);
// 获取苗圃信息
export const getNurserys = forestFetchAction(`${FOREST_API}/tree/nurserys`, []);
// 获取打包车辆信息
export const getCarpackbysxm = forestFetchAction(`${FOREST_API}/tree/carpackbysxm/{{sxm}}`, []);
// 获取树木现场种植的信息
export const getTreeMess = forestFetchAction(`${FOREST_API}/tree/tree/{{sxm}}`, []);
// 获取人员的具体详情
export const getUserDetail = createFetchAction(`${USER_API}/users/{{pk}}/`, []);
// 获取树的树种类型
export const getTreeTypeAction = forestFetchAction(`${FOREST_API}/tree/treetypes`, []);
// 苗木养护查询
export const getCuring = forestFetchAction(`${FOREST_API}/curing/curings`, [], 'GET');
export const getAdoptTreeOk = createAction(`${ID}苗木结缘树`);
// 获取领养树的全部数据
export const getAdoptTreeData = forestFetchAction(`${FOREST_API}/adopt/adopttrees`, [getAdoptTreeOk], 'GET');
// 根据领养人名称获取领养树
export const getAdoptTreeByAdopter = forestFetchAction(`${FOREST_API}/adopt/adopttrees?aadopter={{aadopter}}`, [], 'GET');
// 获取树木定位信息
export const getTreeLocationCoord = forestFetchAction(`${FOREST_API}/tree/locationcoord?sxm={{sxm}}`, [], 'GET');
// 苗木定位位置地理坐标系查询
export const getTreeLocation = forestFetchAction(`${FOREST_API}/tree/treelocations?sxm={{sxm}}&crs=4326`, [], 'GET');
// 获取苗木结缘信息
export const getAdoptTrees = forestFetchAction(`${FOREST_API}/adopt/adopttrees`, [], 'GET');
// 根据坐标获取地址信息
export const getLocationNameByCoordinate = createFetchAction(`${LBSAMAP_API}/v3/geocode/regeo`, [], 'GET');
// 灌溉官网查询数据
export const getQueryTreePipe = createFetchAction(`${TREEPIPE_API}/pipe/query`, [], 'POST');
export const getCustomViewByUserIDOk = createAction(`${ID}根据用户ID获取用户自定义视图`);
// 根据用户ID获取用户自定义视图
export const getCustomViewByUserID = createFetchAction(`${USER_API}/user/{{id}}/custom-view/`, [getCustomViewByUserIDOk], 'GET');
// 用户创建自定义视图
export const postUserCustomView = createFetchAction(`${USER_API}/custom-view/`, [], 'POST');
// 用户删除自定义视图
export const deleteUserCustomView = createFetchAction(`${USER_API}/custom-view/{{id}}/`, [], 'DELETE');

export const switchDashboardMenuType = createAction(`${ID}切换建设和运营菜单类型`);
export const switchDashboardCompoment = createAction(`${ID}切换二维展示左侧按钮`);
export const getAreaTree = createAction(`${ID}区域地块树`);
export const getRiskTree = createAction(`${ID}安全隐患树`);
export const getRiskTreeDay = createAction(`${ID}安全隐患树天`);
export const getTrackTree = createAction(`${ID}巡检路线树`);
export const getTrackTreeDay = createAction(`${ID}巡检路线树天`);
export const getTreetypesTree = createAction(`${ID}树种筛选树`);
export const getCuringTaskTree = createAction(`${ID}养护任务树`);
export const getCuringTaskTreeDay = createAction(`${ID}养护任务树天`);
export const getSurvivalRateTree = createAction(`${ID}成活率树`);
export const getCuringTypeData = createAction(`${ID}养护类型`);
export const getMenuTreeVisible = createAction(`${ID}是否显示树`);
export const switchDashboardRightMenu = createAction(`${ID}切换二维展示右侧按钮`);
export const switchDashboardFullScreenState = createAction(`${ID}切换二维展示全屏`);
export const switchDashboardAreaTreeLayer = createAction(`${ID}切换二维展示树图层`);
export const switchDashboardDataMeasurement = createAction(`${ID}切换二维展示数据测量`);
export const switchDashboardFocus = createAction(`${ID}切换二维展示聚焦初始位置`);
export const switchDashboardTreeMess = createAction(`${ID}切换二维展示树木信息`);
export const getAreaTreeLoading = createAction(`${ID}区域地块树加载loading`);
export const getRiskTreeLoading = createAction(`${ID}安全隐患树加载loading`);
export const getTrackTreeLoading = createAction(`${ID}巡检路线树加载loading`);
export const getTreetypesTreeLoading = createAction(`${ID}树种筛选树加载loading`);
export const getCuringTaskTreeLoading = createAction(`${ID}养护任务树加载loading`);
export const getSurvivalRateTreeLoading = createAction(`${ID}成活率树加载loading`);
export const getAdoptTreeLoading = createAction(`${ID}苗木结缘树加载loading`);
export const setUserMapPositionName = createAction(`${ID}设置用户定位的视图名称`);
export const switchAreaDistanceMeasureMenu = createAction(`${ID}切换二维展示面积测量和距离测量`);

export const actions = {
    getRisk,
    getRiskContactSheet,
    getInspectRouter,
    getMapList,
    getTreeflows,
    getNurserys,
    getCarpackbysxm,
    getTreeMess,
    getUserDetail,
    getTreeTypeAction,
    getCuring,
    getAdoptTreeOk,
    getAdoptTreeData,
    getAdoptTreeByAdopter,
    getTreeLocationCoord,
    getTreeLocation,
    getAdoptTrees,
    getLocationNameByCoordinate,
    getCustomViewByUserIDOk,
    getCustomViewByUserID,
    postUserCustomView,
    deleteUserCustomView,
    getQueryTreePipe,

    switchDashboardCompoment,
    getAreaTree,
    getRiskTree,
    getRiskTreeDay,
    getTrackTree,
    getTrackTreeDay,
    getTreetypesTree,
    getCuringTaskTree,
    getCuringTaskTreeDay,
    getSurvivalRateTree,
    getCuringTypeData,
    getMenuTreeVisible,
    switchDashboardMenuType,
    switchDashboardRightMenu,
    switchDashboardFullScreenState,
    switchDashboardAreaTreeLayer,
    switchDashboardDataMeasurement,
    switchDashboardFocus,
    switchDashboardTreeMess,
    getAreaTreeLoading,
    getRiskTreeLoading,
    getTrackTreeLoading,
    getTreetypesTreeLoading,
    getCuringTaskTreeLoading,
    getSurvivalRateTreeLoading,
    getAdoptTreeLoading,
    setUserMapPositionName,
    switchAreaDistanceMeasureMenu
};
export default handleActions(
    {
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
        [getRiskTreeDay]: (state, { payload }) => {
            return {
                ...state,
                riskTreeDay: payload
            };
        },
        [getTrackTree]: (state, { payload }) => {
            return {
                ...state,
                trackTree: payload
            };
        },
        [getTrackTreeDay]: (state, { payload }) => {
            return {
                ...state,
                trackTreeDay: payload
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
        [getCuringTaskTreeDay]: (state, { payload }) => {
            return {
                ...state,
                curingTaskTreeDay: payload
            };
        },
        [getSurvivalRateTree]: (state, { payload }) => {
            return {
                ...state,
                survivalRateTree: payload
            };
        },
        [getAdoptTreeOk]: (state, { payload }) => {
            return {
                ...state,
                adoptTree: payload
            };
        },
        [getCuringTypeData]: (state, { payload }) => {
            return {
                ...state,
                curingTypes: payload
            };
        },
        [getMenuTreeVisible]: (state, { payload }) => {
            return {
                ...state,
                menuTreeVisible: payload
            };
        },
        [switchDashboardMenuType]: (state, { payload }) => {
            return {
                ...state,
                dashboardMenuType: payload
            };
        },
        [switchDashboardRightMenu]: (state, { payload }) => {
            return {
                ...state,
                dashboardRightMenu: payload
            };
        },
        [switchDashboardFullScreenState]: (state, { payload }) => {
            return {
                ...state,
                dashboardFullScreenState: payload
            };
        },
        [switchDashboardAreaTreeLayer]: (state, { payload }) => {
            return {
                ...state,
                dashboardAreaTreeLayer: payload
            };
        },
        [switchDashboardDataMeasurement]: (state, { payload }) => {
            return {
                ...state,
                dashboardDataMeasurement: payload
            };
        },
        [switchDashboardFocus]: (state, { payload }) => {
            return {
                ...state,
                dashboardFocus: payload
            };
        },
        [switchDashboardTreeMess]: (state, { payload }) => {
            return {
                ...state,
                dashboardTreeMess: payload
            };
        },
        [getAreaTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                areaTreeLoading: payload
            };
        },
        [getRiskTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                riskTreeLoading: payload
            };
        },
        [getTrackTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                trackTreeLoading: payload
            };
        },
        [getTreetypesTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                treetypesTreeLoading: payload
            };
        },
        [getCuringTaskTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                curingTaskTreeLoading: payload
            };
        },
        [getSurvivalRateTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                survivalRateTreeLoading: payload
            };
        },
        [getAdoptTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                adoptTreeLoading: payload
            };
        },
        [setUserMapPositionName]: (state, { payload }) => {
            return {
                ...state,
                userMapPositionName: payload
            };
        },
        [getCustomViewByUserIDOk]: (state, { payload }) => {
            return {
                ...state,
                customViewByUserID: payload
            };
        },
        [switchAreaDistanceMeasureMenu]: (state, { payload }) => {
            return {
                ...state,
                areaDistanceMeasureMenu: payload
            };
        }
    },
    {}
);
