import {
    createAction,
    handleActions,
    combineActions
} from 'redux-actions';
import createFetchAction from './fetchAction';
import {
    createFetchActionWithHeaders as myFetch
} from './fetchAction';
import faithInfoReducer, {
    actions as faithActions
} from './faithInfo';
import {
    FOREST_API,
    TENCENTANALYSIS_API,
    USER_API
} from '_platform/api';
import {
    forestFetchAction
} from '_platform/store/fetchAction';
import {
    actionsMap
} from '_platform/store/util';
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
export const getForestUsers = forestFetchAction(`${FOREST_API}/system/users`, [
    getForestUsersOK
]);

export const getTree = forestFetchAction(`${FOREST_API}/tree/wpunits`, [
    getTreeOK
]); //    √
export const getNurseryBackstat = forestFetchAction(`${FOREST_API}/tree/nurserybackstat?`); // 苗木整车退苗分析
export const getCarpackstat = forestFetchAction(`${FOREST_API}/tree/carpackstat?`); // 车辆包大数据统计
export const getCarinstat = forestFetchAction(`${FOREST_API}/tree/carinstat?`, []); // 车辆进场分析
export const getCarbackstat = forestFetchAction(`${FOREST_API}/tree/carbackstat?`); // 车辆包退苗分析
export const getNurseryinstat = forestFetchAction(`${FOREST_API}/tree/nurseryinstat?`); // 苗木进场分析
export const getNurserybackstat = forestFetchAction(`${FOREST_API}/tree/nurserybackstat?`); // 苗木退苗分析
export const getNurserytotal = forestFetchAction(`${FOREST_API}/tree/nurserytotal?`); // 苗木进场出圃统计
export const getLocationtotalstat = forestFetchAction(`${FOREST_API}/tree/locationtotalstat?`); // 苗木定位总统计
export const getCountSection = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=Section`,
    []
); // 获取各标段种植数量

export const getCountSmall = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`,
    []
); // 获取各小班种植数量
export const getCountThin = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`,
    []
); // 获取各细班种植数量
export const getTreeevery = forestFetchAction(
    `${FOREST_API}/tree/treetypes`,
    []
);
export const gettreetype = forestFetchAction(
    `${FOREST_API}/tree/treetypesbyno`,
    []
);
export const getfactoryAnalyse = forestFetchAction(
    `${FOREST_API}/tree/factoryAnalyse`,
    []
);
export const getnurserys = forestFetchAction(`${FOREST_API}/tree/nurserys`, []);
export const getNurserysTree = forestFetchAction(
    `${FOREST_API}/tree/treenurserys`,
    []
);
export const getqueryTree = forestFetchAction(
    `${FOREST_API}/tree/queryTree`,
    []
);
export const getTreeList = forestFetchAction(`${FOREST_API}/tree/treetypes`, [
    getTreeListOK
]);
export const getexportFactoryAnalyseInfo = forestFetchAction(
    `${FOREST_API}/tree/exportFactoryAnalyseInfo`,
    []
);
export const getexportFactoryAnalyseDetailInfo = forestFetchAction(
    `${FOREST_API}/tree/exportFactoryAnalyseDetailInfo`,
    []
);
export const getexportFactoryAnalyse = forestFetchAction(
    `${FOREST_API}/tree/exportFactoryAnalyse`,
    []
);
export const getexportTree4Checker = forestFetchAction(
    `${FOREST_API}/tree/exportTree4Checker`,
    []
);
export const getexportTree4Supervisor = forestFetchAction(
    `${FOREST_API}/tree/exportTree4Supervisor`,
    []
);
export const getexportTree = forestFetchAction(
    `${FOREST_API}/tree/exportTree`,
    []
);
export const getexportNurserys = forestFetchAction(
    `${FOREST_API}/tree/exportNurserys`,
    []
);
export const getexportTreeNurserys = forestFetchAction(
    `${FOREST_API}/tree/exportTreeNurserys`,
    []
);

export const getNurserysCount = forestFetchAction(
    `${FOREST_API}/tree/nurserys/count/`,
    []
);
export const getNurserysCountFast = forestFetchAction(
    `${FOREST_API}/tree/nurserys/count/fast/`,
    []
);
export const getNurserysProgress = forestFetchAction(
    `${FOREST_API}/tree/nurserys/progress/`,
    []
);
export const getTotalSat = forestFetchAction(
    `${FOREST_API}/tree/totalstat`,
    []
);
export const getquality = forestFetchAction(`${FOREST_API}/trees/quality/`, []);
export const getreturn = forestFetchAction(`${FOREST_API}/trees/return/`, []);
export const getreturnowner = forestFetchAction(
    `${FOREST_API}/trees/return/owner/`,
    []
);
export const getreturnsupervision = forestFetchAction(
    `${FOREST_API}/trees/return/supervision/`,
    []
);
export const getCount = forestFetchAction(`${FOREST_API}/tree/treestat`, []);
export const getTreesProgress = forestFetchAction(
    `${FOREST_API}/trees/progress/`,
    []
);
export const getSmallClassList = forestFetchAction(
    `${FOREST_API}/tree/wpunit4apps?parent={{no}}`,
    []
);

export const getHonesty = forestFetchAction(`${FOREST_API}/trees/honesty/`, []);
export const getHonestyNursery = forestFetchAction(
    `${FOREST_API}/trees/honesty/nursery/`,
    []
);
export const getHonestyNew = forestFetchAction(
    `${FOREST_API}/tree/factoryAnalyseInfo`,
    []
);
export const getHonestyNewSort = forestFetchAction(
    `${FOREST_API}/trees/honesty/new/fast/?sort=true`,
    []
);
export const postFile = forestFetchAction(
    `${FOREST_API}/db/import_location/`,
    [],
    'POST'
);
export const getHonestyNewDetail = forestFetchAction(
    `${FOREST_API}/tree/factoryAnalyseDetailInfo?factory={{name}}`,
    [getHonestyNewDetailOk],
    'GET'
);
export const getHonestyNewDetailModal = forestFetchAction(
    `${FOREST_API}/trees/honesty/new/?detail=true`,
    []
);
export const getHonestyNewTreetype = forestFetchAction(
    `${FOREST_API}/tree/factoryanalysebytreetype`,
    ''
);
export const postPositionData = forestFetchAction(
    `${FOREST_API}/tree/importLocations?user={{id}}`,
    [],
    'POST'
); //    √
export const getcarpackage = forestFetchAction(
    `${FOREST_API}/tree/carpacks`,
    []
);
export const getexportcarpackage = forestFetchAction(
    `${FOREST_API}/tree/exportcarpacks`,
    []
);
export const getNurserysByPack = forestFetchAction(
    `${FOREST_API}/tree/nurserysbypack`,
    []
);
export const getTreeLocations = forestFetchAction(
    `${FOREST_API}/tree/treelocations`,
    []
); // 获取同步后的苗木定位列表
export const getExportTreeLocations = forestFetchAction(
    `${FOREST_API}/tree/exporttreelocations`,
    []
); // 导出同步后的苗木定位列表

export const getSeedlingInfo = forestFetchAction(
    `${FOREST_API}/tree/remarktree?remark={{remark}}&pics={{pics}}&sxm={{sxm}}`,
    []
); // 修改备注信息

// 获取种植流程
export const getTreeflows = forestFetchAction(
    `${FOREST_API}/tree/treeflows`,
    []
);
// 获取打包车辆信息
export const getCarpackbysxm = forestFetchAction(
    `${FOREST_API}/tree/carpackbysxm/{{sxm}}`,
    []
);
// 获取树木现场种植的信息
export const getTreeMess = forestFetchAction(
    `${FOREST_API}/tree/tree/{{sxm}}`,
    []
);
// 获取树木定位信息
export const getTreeLocationCoord = forestFetchAction(
    `${FOREST_API}/tree/locationcoord?sxm={{sxm}}`,
    [], 'GET'
);

export const postForsetPic = myFetch(
    `${FOREST_API}/UploadHandler.ashx?filetype=leader`,
    [],
    'POST'
);
export const clearTreeData = forestFetchAction(
    `${FOREST_API}/tree/cleartreedata`,
    [],
    'GET'
);

// 栽植、未栽植数量统计
export const getTreePlanting = forestFetchAction(
    `${FOREST_API}/tree/treestat4pie`,
    []
);

// 定位、未定位数量统计，用于饼图
export const getLocationStat = forestFetchAction(
    `${FOREST_API}/tree/locationstat4pie`,
    []
);

// 按树种统计栽植量
export const getStatByTreetype = forestFetchAction(
    `${FOREST_API}/tree/statbytreetype`,
    []
);

// 获取死亡记录或结缘筛选记录
export const getTreeStatuss = forestFetchAction(
    `${FOREST_API}/tree/treestatuss`,
    []
);
// 获取标段，小班或者细班的定位量
export const getLocationStatBySpecfield = forestFetchAction(
    `${FOREST_API}/tree/locationstatbyspecfield`,
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

// 获取苗木来源地分析数据
export const getNurseryFromData = forestFetchAction(
    `${FOREST_API}/tree/nursersourcestat?section={{section}}&regioncode={{regioncode}}&etime={{etime}}`,
    []
);
export const getTreeEntrance = forestFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);
// 用户分析用户统计
export const getUserStat = forestFetchAction(
    `${FOREST_API}/tree/userstat`,
    []
);
// 用户分析新增用户统计
export const getNewUserStat = forestFetchAction(
    `${FOREST_API}/tree/newuserstat`,
    []
);
// 用户分析活跃用户统计
export const getActivityUserStat = forestFetchAction(
    `${FOREST_API}/tree/activityuserstat`,
    []
);
// 用户分析用户按标段统计
export const getSectionUserStat = forestFetchAction(
    `${FOREST_API}/tree/sectionuserstat`,
    []
);
// 根据细班信息获取树种列表
export const getTreetypeByThinclass = forestFetchAction(
    `${FOREST_API}/route/thinclassplans`,
    []
);

export const getCustomViewByUserIDOk = createAction(`${ID}根据用户ID获取用户自定义视图`);
// 根据用户ID获取用户自定义视图
export const getCustomViewByUserID = createFetchAction(`${USER_API}/user/{{id}}/custom-view/`, [getCustomViewByUserIDOk], 'GET');
export const getTreearea = forestFetchAction(`${FOREST_API}/route/thinclasses?`, [], 'GET'); // 获取细班详情

// 苗木来源地分析苗圃总览 苗圃基地、供应商数据统计
export const getNurseryBaseStat = forestFetchAction(
    `${FOREST_API}/tree/nurserybasestat`,
    []
);
// 苗木来源地分析苗圃总览 苗圃基地进场统计
export const getNurseryEnterStat = forestFetchAction(
    `${FOREST_API}/tree/nurseryinstatbynurserybase`,
    []
);
// 苗木来源地分析苗圃总览 供应商苗木进场统计
export const getSupplierEnterStat = forestFetchAction(
    `${FOREST_API}/tree/nurseryinstatbysupplier`,
    []
);
// 苗木来源地分析苗圃总览 苗圃基地退苗统计
export const getNurseryBackStat = forestFetchAction(
    `${FOREST_API}/tree/nurserybackstatbynurserybase`,
    []
);
// 苗木来源地分析苗圃总览 供应商苗木退苗统计
export const getSupplierBackStat = forestFetchAction(
    `${FOREST_API}/tree/nurserybackstatbysupplier`,
    []
);
// 获取苗圃列表
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`, [], 'GET', []);

// 获取供应商列表
export const getSupplierListOK = createAction(`${ID}_getSupplierList`);
export const getSupplierList = forestFetchAction(`${FOREST_API}/system/suppliers`, [], 'GET', []);
// 数据维护
// 修改苗圃信息
export const putChangeNurseryInfoInCar = forestFetchAction(`${FOREST_API}/tree/batchnursery`, [], 'PUT', []);
// 修改车辆信息
export const putChangCarPackInfo = forestFetchAction(`${FOREST_API}/tree/carpack`, [], 'PUT', []);
// 车辆包合并
export const putMergeCarPack = forestFetchAction(`${FOREST_API}/tree/packmerge`, [], 'PUT', []);
// 车辆包内苗木移动车辆包内苗木移动
export const putMoveTreeInCar = forestFetchAction(`${FOREST_API}/tree/packnurserymove`, [], 'PUT', []);
// 修改现场测量信息
export const putChangeLocInfo = forestFetchAction(`${FOREST_API}/tree/batchtree`, [], 'PUT', []);
// 导出苗木死亡信息
export const exportEcporttreestatuss = forestFetchAction(`${FOREST_API}/tree/ecporttreestatuss`, [], 'GET', []);

/**
 * 数字化验收
 * actions
 */
// 获取数字化验收列表
export const getDigitalAcceptList = forestFetchAction(
    `${FOREST_API}/tree/acceptances`,
    []
);

// 获取数字化验收详情
export const getDigitalAcceptDetail = forestFetchAction(
    `${FOREST_API}/tree/acceptancedetails`,
    []
);

// 获取数字化验收人员列表
export const getDigitalAcceptUserList = createFetchAction(
    `${USER_API}/users/?is_active=true`,
    []
);
// 获取苗木质量验收结果列表
export const getMQulityCheckList = forestFetchAction(
    `${FOREST_API}/tree/qualitytrees`,
    []
);
// 获取土球质量验收结果列表
export const getTQulityCheckList = forestFetchAction(
    `${FOREST_API}/tree/samplingnurserys`,
    []
);
// 获取苗木(栽植/支架/浇水)验收结果列表
export const getZZJQulityCheckList = forestFetchAction(
    `${FOREST_API}/tree/patrolevents`,
    []
);
// 大数据验收结果列表
export const getBigDataCheckList = forestFetchAction(
    `${FOREST_API}/tree/trees`,
    []
);
// 数字化验收导出表格数据
export const getExportAcceptList = forestFetchAction(`${FOREST_API}/tree/exportacceptances`, [], 'GET', []);
// 数字化验收导出验收单
export const getExportAcceptReport = forestFetchAction(`${FOREST_API}/DocExport.ashx?action=acceptance&acceptancedetailid={{acceptancedetailid}}`, [], 'GET', []);
// 获取标段对应的公司名称和项目经理
export const getUnitMessageBySection = forestFetchAction(`${FOREST_API}/tree/sections`, [], 'GET', []);
// 获取标段对应的公司名称和项目经理
export const postMapImage = forestFetchAction(`${FOREST_API}/route/mapimage`, [], 'POST', []);
// 获取第十项信息
export const getAcceptanceThinclasses = forestFetchAction(`${FOREST_API}/route/acceptancethinclasses`, [], 'GET', []);
// 查询细班验收施工是否提交，是否还需要反复提交
export const getAreaAcceptByThinClass = forestFetchAction(`${FOREST_API}/route/acceptancethinclasses`, [], 'GET');
// 辅助验收模块
export const getSupervisorUsersOK = createAction(`${ID}获取监理用户列表`);
export const getSupervisorUsers = createFetchAction(`${USER_API}/users/`, [getSupervisorUsersOK]);
// 面积验收施工提交
export const postAreaAccept = forestFetchAction(`${FOREST_API}/route/acceptancethinclass`, [], 'POST', []);
// 获取人员的具体详情
export const getForestUserUsername = createFetchAction(`${FOREST_API}/system/users`, []);

// 死亡苗木信息
// 获取死亡苗木信息
export const getDieTreesData = forestFetchAction(
    `${FOREST_API}/tree/dietrees`,
    []
);
// 导出死亡苗木列表
export const getExportDieTree = forestFetchAction(
    `${FOREST_API}/tree/exportDieTree`,
    []
);

export const actions = {
    exportEcporttreestatuss,
    getTotalSat,
    getTreeLocations,
    getExportTreeLocations,
    getForestUsers,
    getTreeOK,
    getTree,
    setkeycode,
    getCarinstat,
    getNurseryBackstat,
    getNurseryinstat,
    getNurserybackstat,
    getNurserytotal,
    getLocationtotalstat,
    getCarpackstat,
    getCarbackstat,
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
    postPositionData,
    getcarpackage,
    getexportcarpackage,
    getNurserysByPack,
    getSeedlingInfo,
    getTreeflows,
    getCarpackbysxm,
    getTreeMess,
    getTreeLocationCoord,
    postForsetPic,
    clearTreeData,
    getTreePlanting,
    getLocationStat,
    getStatByTreetype,
    getTreeStatuss,
    getTencentRealTimeUser,
    getTencentOffLineUser,
    getTencentOffLineActive,
    getTencentOffLineAusage,
    getNurseryFromData,
    getTreeEntrance,
    getDigitalAcceptList,
    getDigitalAcceptUserList,
    getDigitalAcceptDetail,
    getUserStat,
    getNewUserStat,
    getActivityUserStat,
    getSectionUserStat,
    getTQulityCheckList,
    getZZJQulityCheckList,
    getCustomViewByUserIDOk,
    getCustomViewByUserID,
    getTreearea,
    getNurseryBaseStat,
    getNurseryEnterStat,
    getSupplierEnterStat,
    getNurseryBackStat,
    getSupplierBackStat,
    getNurseryListOK,
    getNurseryList,
    getSupplierListOK,
    getSupplierList,
    putChangeNurseryInfoInCar,
    putChangCarPackInfo,
    putMergeCarPack,
    putMoveTreeInCar,
    putChangeLocInfo,
    getUnitMessageBySection,
    getExportAcceptList,
    getExportAcceptReport,
    getBigDataCheckList,
    postMapImage,
    getAcceptanceThinclasses,
    getDieTreesData,
    getExportDieTree,
    getAreaAcceptByThinClass,
    getSupervisorUsersOK,
    getSupervisorUsers,
    postAreaAccept,
    getForestUserUsername
};
export default handleActions({
    [getTreeOK]: (state, {
        payload
    }) => {
        return {
            ...state,
            treeLists: [payload]
        };
    },
    [setkeycode]: (state, {
        payload
    }) => {
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
    [getForestUsersOK]: (state, {
        payload: {
            content
        }
    }) => {
        let users = {};
        if (content) {
            content.forEach(user => (users[user.ID] = user));
        }
        return {
            ...state,
            users
        };
    },
    [getTreeListOK]: (state, {
        payload
    }) => ({
        ...state,
        treetypes: payload
    }),
    [getHonestyNewDetailOk]: (state, {
        payload
    }) => ({
        ...state,
        honestyList: payload
    }),
    [clearList]: (state, {
        payload
    }) => ({
        ...state,
        honestyList: payload
    }),
    [nurseryName]: (state, {
        payload
    }) => ({
        ...state,
        nurseryName: payload
    }),
    [getCustomViewByUserIDOk]: (state, { payload }) => {
        return {
            ...state,
            customViewByUserID: payload
        };
    },
    [getNurseryListOK]: (state, { payload }) => {
        return {
            ...state,
            nurseryList: payload
        };
    },
    [getSupplierListOK]: (state, { payload }) => {
        return {
            ...state,
            supplierList: payload
        };
    },
    [getSupervisorUsersOK]: (state, { payload }) => {
        return {
            ...state,
            supervisorUsersList: payload
        };
    }
}, {});
