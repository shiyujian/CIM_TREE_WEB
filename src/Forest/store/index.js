import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import { createFetchActionWithHeaders as myFetch } from './fetchAction';
//
import faithInfoReducer, { actions as faithActions } from './faithInfo';
import { FOREST_API, FOREST_SYSTEM, TENCENTANALYSIS_API } from '_platform/api';
import { actionsMap } from '_platform/store/util';
const ID = 'forest';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const changeNursery = createAction(`${ID}传递nurseryName`);
export const getHonestyNewDetailOk = createAction(`${ID}存储返回的详情`);
export const clearList = createAction(`${ID}清空列表`);
export const nurseryName = createAction(`${ID}供应商名字`);
const getForestUsersOK = createAction('获取森林数据用户列表');
const getTreeListOK = createAction('获取森林树种列表');

/** ***************************院内************************/
export const getForestUsers = createFetchAction(`${FOREST_SYSTEM}/users`, [
    getForestUsersOK
]);

export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [
    getTreeOK
]); //    √
// 苗木进场
export const gettreeEntrance = createFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);
export const getTreeevery = createFetchAction(
    `${FOREST_API}/tree/treetypes`,
    []
);
export const gettreetype = createFetchAction(
    `${FOREST_API}/tree/treetypesbyno`,
    []
);
export const getfactoryAnalyse = createFetchAction(
    `${FOREST_API}/tree/factoryAnalyse`,
    []
);
export const getForestTreeNodeList = createFetchAction(
    `${FOREST_API}/tree/wpunittree`,
    []
); //    √
export const getnurserys = createFetchAction(`${FOREST_API}/tree/nurserys`, []);
export const getNurserysTree = createFetchAction(
    `${FOREST_API}/tree/treenurserys`,
    []
);
export const getqueryTree = createFetchAction(
    `${FOREST_API}/tree/queryTree`,
    []
);
export const getTreeList = createFetchAction(`${FOREST_API}/tree/treetypes`, [
    getTreeListOK
]);
export const getexportFactoryAnalyseInfo = createFetchAction(
    `${FOREST_API}/tree/exportFactoryAnalyseInfo`,
    []
);
export const getexportFactoryAnalyseDetailInfo = createFetchAction(
    `${FOREST_API}/tree/exportFactoryAnalyseDetailInfo`,
    []
);
export const getexportFactoryAnalyse = createFetchAction(
    `${FOREST_API}/tree/exportFactoryAnalyse`,
    []
);
export const getexportTree4Checker = createFetchAction(
    `${FOREST_API}/tree/exportTree4Checker`,
    []
);
export const getexportTree4Supervisor = createFetchAction(
    `${FOREST_API}/tree/exportTree4Supervisor`,
    []
);
export const getexportTree = createFetchAction(
    `${FOREST_API}/tree/exportTree`,
    []
);
export const getexportNurserys = createFetchAction(
    `${FOREST_API}/tree/exportNurserys`,
    []
);
export const getexportTreeNurserys = createFetchAction(
    `${FOREST_API}/tree/exportTreeNurserys`,
    []
);

export const getNurserysCount = createFetchAction(
    `${FOREST_API}/tree/nurserys/count/`,
    []
);
export const getNurserysCountFast = createFetchAction(
    `${FOREST_API}/tree/nurserys/count/fast/`,
    []
);
export const getNurserysProgress = createFetchAction(
    `${FOREST_API}/tree/nurserys/progress/`,
    []
);
export const getTotalSat = createFetchAction(
    `${FOREST_API}/tree/totalstat`,
    []
);
export const getquality = createFetchAction(`${FOREST_API}/trees/quality/`, []);
export const getreturn = createFetchAction(`${FOREST_API}/trees/return/`, []);
export const getreturnowner = createFetchAction(
    `${FOREST_API}/trees/return/owner/`,
    []
);
export const getreturnsupervision = createFetchAction(
    `${FOREST_API}/trees/return/supervision/`,
    []
);
export const getCount = createFetchAction(`${FOREST_API}/tree/treestat`, []);
export const getTreesProgress = createFetchAction(
    `${FOREST_API}/trees/progress/`,
    []
);
export const getCountSection = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=Section`,
    []
);
export const getCountSmall = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`,
    []
);
export const getCountThin = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`,
    []
);
export const getSmallClassList = createFetchAction(
    `${FOREST_API}/tree/wpunit4apps?parent={{no}}`,
    []
);

export const getHonesty = createFetchAction(`${FOREST_API}/trees/honesty/`, []);
export const getHonestyNursery = createFetchAction(
    `${FOREST_API}/trees/honesty/nursery/`,
    []
);
export const getHonestyNew = createFetchAction(
    `${FOREST_API}/tree/factoryAnalyseInfo`,
    []
);
export const getHonestyNewSort = createFetchAction(
    `${FOREST_API}/trees/honesty/new/fast/?sort=true`,
    []
);
export const postFile = createFetchAction(
    `${FOREST_API}/db/import_location/`,
    [],
    'POST'
);
export const getHonestyNewDetail = createFetchAction(
    `${FOREST_API}/tree/factoryAnalyseDetailInfo?factory={{name}}`,
    [getHonestyNewDetailOk],
    'GET'
);
export const getHonestyNewDetailModal = createFetchAction(
    `${FOREST_API}/trees/honesty/new/?detail=true`,
    []
);
export const getHonestyNewTreetype = createFetchAction(
    `${FOREST_API}/tree/factoryanalysebytreetype`,
    ''
);
export const postPositionData = createFetchAction(
    `${FOREST_API}/tree/importLocations?user={{id}}`,
    [],
    'POST'
); //    √
export const getcarpackage = createFetchAction(
    `${FOREST_API}/tree/carpacks`,
    []
);
export const getexportcarpackage = createFetchAction(
    `${FOREST_API}/tree/exportcarpacks`,
    []
);
export const getNurserysByPack = createFetchAction(
    `${FOREST_API}/tree/nurserysbypack`,
    []
);
export const getTreeLocations = createFetchAction(
    `${FOREST_API}/tree/treelocations`,
    []
); // 获取同步后的苗木定位列表
export const getExportTreeLocations = createFetchAction(
    `${FOREST_API}/tree/exporttreelocations`,
    []
); // 导出同步后的苗木定位列表

export const getSeedlingInfo = createFetchAction(
    `${FOREST_API}/tree/remarktree?remark={{remark}}&pics={{pics}}&sxm={{sxm}}`,
    []
); // 修改备注信息

// 获取种植流程
export const getTreeflows = createFetchAction(
    `${FOREST_API}/tree/treeflows`,
    []
);
// 获取打包车辆信息
export const getCarpackbysxm = createFetchAction(
    `${FOREST_API}/tree/carpackbysxm/{{sxm}}`,
    []
);
// 获取树木现场种植的信息
export const getTreeMess = createFetchAction(
    `${FOREST_API}/tree/tree/{{sxm}}`,
    []
);

export const postForsetPic = myFetch(
    `${FOREST_API}/UploadHandler.ashx?filetype=leader`,
    [],
    'POST'
);

// 栽植、未栽植数量统计
export const getTreePlanting = createFetchAction(
    `${FOREST_API}/tree/treestat4pie`,
    []
);

// 定位、未定位数量统计，用于饼图
export const getLocationStat = createFetchAction(
    `${FOREST_API}/tree/locationstat4pie`,
    []
);

// 按树种统计栽植量
export const getStatByTreetype = createFetchAction(
    `${FOREST_API}/tree/statbytreetype`,
    []
);

// 获取死亡记录或结缘筛选记录
export const getTreeStatuss = createFetchAction(
    `${FOREST_API}/tree/treestatuss`,
    []
);

// 获取腾讯移动数据分析实时数据
export const getTencentRealTimeUser = createFetchAction(
    `${TENCENTANALYSIS_API}/TencentAPIHandler.ashx?action=realtimeuser`,
    []
);
// 获取腾讯移动数据分析历史数据
export const getTencentOffLineUser = createFetchAction(
    `${TENCENTANALYSIS_API}/TencentAPIHandler.ashx?action=offlineuser`,
    []
);
// 获取腾讯移动数据分析用户行为数据
export const getTencentOffLineActive = createFetchAction(
    `${TENCENTANALYSIS_API}/TencentAPIHandler.ashx?action=offlineactive`,
    []
);
// 获取腾讯移动数据分析用户时长数据
export const getTencentOffLineAusage = createFetchAction(
    `${TENCENTANALYSIS_API}/TencentAPIHandler.ashx?action=offlineausage`,
    []
);

export const actions = {
    getTotalSat,
    getTreeLocations,
    getExportTreeLocations,
    getForestUsers,
    getTreeOK,
    getTree,
    setkeycode,
    gettreeEntrance,
    gettreetype,
    getfactoryAnalyse,
    getnurserys,
    getqueryTree,
    getNurserysTree,
    getexportTree,
    getexportFactoryAnalyseInfo,
    getexportFactoryAnalyseDetailInfo,
    getexportFactoryAnalyse,
    getexportTree4Checker,
    getexportTree4Supervisor,
    getexportNurserys,
    getexportTreeNurserys,
    getTreeList,
    getNurserysCount,
    getNurserysProgress,
    getquality,
    getreturn,
    getreturnowner,
    getreturnsupervision,
    getCount,
    getTreesProgress,
    getCountSection,
    getCountSmall,
    getCountThin,
    getSmallClassList,
    getHonesty,
    getHonestyNursery,
    getHonestyNew,
    postFile,
    getHonestyNewDetailOk,
    getHonestyNewDetail,
    clearList,
    nurseryName,
    getHonestyNewSort,
    getNurserysCountFast,
    getHonestyNewTreetype,
    getHonestyNewDetailModal,
    getForestTreeNodeList,
    postPositionData,
    getcarpackage,
    getexportcarpackage,
    getNurserysByPack,
    getSeedlingInfo,
    getTreeflows,
    getCarpackbysxm,
    getTreeMess,
    postForsetPic,
    getTreePlanting,
    getLocationStat,
    getStatByTreetype,
    getTreeStatuss,
    getTencentRealTimeUser,
    getTencentOffLineUser,
    getTencentOffLineActive,
    getTencentOffLineAusage
};
export default handleActions(
    {
        [getTreeOK]: (state, { payload }) => {
            return {
                ...state,
                treeLists: [payload]
            };
        },
        [setkeycode]: (state, { payload }) => {
            return {
                ...state,
                keycode: payload
            };
        },
        [combineActions(...actionsMap(faithActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            faith: faithInfoReducer(state.faith, action)
        }),
        [getForestUsersOK]: (state, { payload: { content } }) => {
            let users = {};
            if (content) {
                content.forEach(user => (users[user.ID] = user));
            }
            return {
                ...state,
                users
            };
        },
        [getTreeListOK]: (state, { payload }) => ({
            ...state,
            treetypes: payload
        }),
        [getHonestyNewDetailOk]: (state, { payload }) => ({
            ...state,
            honestyList: payload
        }),
        [clearList]: (state, { payload }) => ({
            ...state,
            honestyList: payload
        }),
        [nurseryName]: (state, { payload }) => ({
            ...state,
            nurseryName: payload
        })
    },
    {}
);
