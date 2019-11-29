import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {forestFetchAction} from '_platform/store/fetchAction';
import {
    ADOPT_API,
    TREEPIPE_API,
    SYSTEM_API,
    TREE_API,
    CURING_API,
    GARDEN_API
} from '_platform/api';
const ID = 'dashboard';
// 获取隐患列表
export const getRisk = forestFetchAction(`${TREE_API}/patrolevents`, []);
// 获取隐患详情
export const getRiskContactSheet = forestFetchAction(`${TREE_API}/patrolevent/{{ID}}`, []);
// 获取巡检路线
export const getInspectRouter = forestFetchAction(`${TREE_API}/patrolroutes`, [], 'GET');
// 获取轨迹列表
export const getMapList = forestFetchAction(`${TREE_API}/patrolpositions?routeid={{routeID}}`, []);
// 获取种植流程
export const getTreeflows = forestFetchAction(`${TREE_API}/treeflows`, []);
// 获取苗圃信息
export const getNurserys = forestFetchAction(`${TREE_API}/nurserys`, []);
// 获取打包车辆信息
export const getCarpackbysxm = forestFetchAction(`${TREE_API}/carpackbysxm/{{sxm}}`, []);
// 获取树木现场种植的信息
export const getTreeMess = forestFetchAction(`${TREE_API}/tree/{{sxm}}`, []);
// 获取树的树种类型
export const getTreeTypeAction = forestFetchAction(`${TREE_API}/treetypes`, []);
// 苗木养护查询
export const getCuring = forestFetchAction(`${CURING_API}/curings`, [], 'GET');
export const getAdoptTreeOk = createAction(`${ID}苗木结缘树`);
// 获取领养树的全部数据
export const getAdoptTreeData = forestFetchAction(`${ADOPT_API}/adopttrees`, [getAdoptTreeOk], 'GET');
// 根据领养人名称获取领养树
export const getAdoptTreeByAdopter = forestFetchAction(`${ADOPT_API}/adopttrees?aadopter={{aadopter}}`, [], 'GET');
// 获取树木定位信息
export const getTreeLocationCoord = forestFetchAction(`${TREE_API}/locationcoord?sxm={{sxm}}`, [], 'GET');
// 苗木定位位置地理坐标系查询
export const getTreeLocation = forestFetchAction(`${TREE_API}/treelocations?sxm={{sxm}}&crs=4326`, [], 'GET');
// 获取苗木结缘信息
export const getAdoptTrees = forestFetchAction(`${ADOPT_API}/adopttrees`, [], 'GET');
// 灌溉官网查询数据
export const getQueryTreePipe = createFetchAction(`${TREEPIPE_API}/pipe/query`, [], 'POST');
// 根据用户ID获取用户自定义视图
export const getCustomViewByUserIDOk = createAction(`${ID}根据用户ID获取用户自定义视图`);
export const getCustomViewByUserID = createFetchAction(`${SYSTEM_API}/userviews?userid={{id}}`, [getCustomViewByUserIDOk], 'GET');
// 用户创建自定义视图
export const postUserCustomView = createFetchAction(`${SYSTEM_API}/userview`, [], 'POST');
// 用户删除自定义视图
export const deleteUserCustomView = createFetchAction(`${SYSTEM_API}/userview/{{id}}`, [], 'DELETE');
// 获取机械列表
export const getLocationDevices = forestFetchAction(`${GARDEN_API}/locationdevices`, []);

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
export const getDeviceTreeLoading = createAction(`${ID}机械设备树加载loading`);
export const getDeviceTree = createAction(`${ID}机械设备树数据`);
export const getDeviceTreeDay = createAction(`${ID}机械设备树数据天`);

export const actions = {
    getRisk,
    getRiskContactSheet,
    getInspectRouter,
    getMapList,
    getTreeflows,
    getNurserys,
    getCarpackbysxm,
    getTreeMess,
    getTreeTypeAction,
    getCuring,
    getAdoptTreeOk,
    getAdoptTreeData,
    getAdoptTreeByAdopter,
    getTreeLocationCoord,
    getTreeLocation,
    getAdoptTrees,
    getCustomViewByUserIDOk,
    getCustomViewByUserID,
    postUserCustomView,
    deleteUserCustomView,
    getQueryTreePipe,
    getLocationDevices,

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
    switchAreaDistanceMeasureMenu,
    getDeviceTreeDay,
    getDeviceTreeLoading,
    getDeviceTree
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
        },
        [getDeviceTreeLoading]: (state, { payload }) => {
            return {
                ...state,
                deviceTreeLoading: payload
            };
        },
        [getDeviceTree]: (state, { payload }) => {
            return {
                ...state,
                deviceTreeData: payload
            };
        },
        [getDeviceTreeDay]: (state, { payload }) => {
            return {
                ...state,
                deviceTreeDataDay: payload
            };
        }
    },
    {}
);
