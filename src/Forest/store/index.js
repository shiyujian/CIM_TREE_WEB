import {
    createAction,
    handleActions,
    combineActions
} from 'redux-actions';
import createFetchAction from './fetchAction';
import {
    createFetchActionWithHeaders as myFetch
} from './fetchAction';
import {
    base,
    UPLOAD_API,
    TENCENTANALYSIS_API,
    SYSTEM_API,
    TREE_API,
    TREES_API,
    ROUTE_API,
    DB_API,
    DOCEXPORT_API,
    TREEPIPE_API
} from '_platform/api';
import {
    forestFetchAction
} from '_platform/store/fetchAction';
const ID = 'forest';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const changeNursery = createAction(`${ID}传递nurseryName`);
export const getHonestyNewDetailOk = createAction(`${ID}存储返回的详情`);
export const clearList = createAction(`${ID}清空列表`);
export const nurseryName = createAction(`${ID}供应商名字`);
const getTreeListOK = createAction('获取森林树种列表');

export const getTree = forestFetchAction(`${TREE_API}/wpunits`, [
    getTreeOK
]); //    √
export const getNurseryBackstat = forestFetchAction(`${TREE_API}/nurserybackstat?`); // 苗木整车退苗分析
export const getCarpackstat = forestFetchAction(`${TREE_API}/carpackstat?`); // 车辆包大数据统计
export const getCarinstat = forestFetchAction(`${TREE_API}/carinstat?`, []); // 车辆进场分析
export const getCarbackstat = forestFetchAction(`${TREE_API}/carbackstat?`); // 车辆包退苗分析
export const getNurseryinstat = forestFetchAction(`${TREE_API}/nurseryinstat?`); // 苗木进场分析
export const getNurserybackstat = forestFetchAction(`${TREE_API}/nurserybackstat?`); // 苗木退苗分析
export const getNurserytotal = forestFetchAction(`${TREE_API}/nurserytotal?`); // 苗木进场出圃统计
export const getLocationtotalstat = forestFetchAction(`${TREE_API}/locationtotalstat?`); // 苗木定位总统计
export const getCountSection = forestFetchAction(
    `${TREE_API}/treestatbyspecfield?stattype=Section`,
    []
); // 获取各标段种植数量

export const getCountSmall = forestFetchAction(
    `${TREE_API}/treestatbyspecfield?stattype=SmallClass`,
    []
); // 获取各小班种植数量
export const getCountThin = forestFetchAction(
    `${TREE_API}/treestatbyspecfield?stattype=ThinClass`,
    []
); // 获取各细班种植数量
export const getTreeevery = forestFetchAction(
    `${TREE_API}/treetypes`,
    []
);
export const gettreetype = forestFetchAction(
    `${TREE_API}/treetypesbyno`,
    []
);
export const getfactoryAnalyse = forestFetchAction(
    `${TREE_API}/factoryAnalyse`,
    []
);
export const getnurserys = forestFetchAction(`${TREE_API}/nurserys`, []);
export const getNurserysTree = forestFetchAction(
    `${TREE_API}/treenurserys`,
    []
);
export const getqueryTree = forestFetchAction(
    `${TREE_API}/queryTree`,
    []
);
export const getTreeList = forestFetchAction(`${TREE_API}/treetypes`, [
    getTreeListOK
]);
export const getexportFactoryAnalyseInfo = forestFetchAction(
    `${TREE_API}/exportFactoryAnalyseInfo`,
    []
);
export const getexportFactoryAnalyseDetailInfo = forestFetchAction(
    `${TREE_API}/exportFactoryAnalyseDetailInfo`,
    []
);
export const getexportFactoryAnalyse = forestFetchAction(
    `${TREE_API}/exportFactoryAnalyse`,
    []
);
export const getexportTree4Checker = forestFetchAction(
    `${TREE_API}/exportTree4Checker`,
    []
);
export const getexportTree4Supervisor = forestFetchAction(
    `${TREE_API}/exportTree4Supervisor`,
    []
);
export const getexportTree = forestFetchAction(
    `${TREE_API}/exportTree`,
    []
);
export const getexportNurserys = forestFetchAction(
    `${TREE_API}/exportNurserys`,
    []
);
export const getexportTreeNurserys = forestFetchAction(
    `${TREE_API}/exportTreeNurserys`,
    []
);

export const getNurserysCount = forestFetchAction(
    `${TREE_API}/nurserys/count/`,
    []
);
export const getNurserysCountFast = forestFetchAction(
    `${TREE_API}/nurserys/count/fast/`,
    []
);
export const getNurserysProgress = forestFetchAction(
    `${TREE_API}/nurserys/progress/`,
    []
);
export const getTotalSat = forestFetchAction(
    `${TREE_API}/totalstat`,
    []
);
export const getquality = forestFetchAction(`${TREES_API}/quality/`, []);
export const getreturn = forestFetchAction(`${TREES_API}/return/`, []);
export const getreturnowner = forestFetchAction(
    `${TREES_API}/return/owner/`,
    []
);
export const getreturnsupervision = forestFetchAction(
    `${TREES_API}/return/supervision/`,
    []
);
export const getCount = forestFetchAction(`${TREE_API}/treestat`, []);
export const getTreesProgress = forestFetchAction(
    `${TREES_API}/progress/`,
    []
);
export const getSmallClassList = forestFetchAction(
    `${TREE_API}/wpunit4apps?parent={{no}}`,
    []
);

export const getHonesty = forestFetchAction(`${TREES_API}/honesty/`, []);
export const getHonestyNursery = forestFetchAction(
    `${TREES_API}/honesty/nursery/`,
    []
);
export const getHonestyNew = forestFetchAction(
    `${TREE_API}/factoryAnalyseInfo`,
    []
);
export const getHonestyNewSort = forestFetchAction(
    `${TREES_API}/honesty/new/fast/?sort=true`,
    []
);
export const postFile = forestFetchAction(
    `${DB_API}/import_location/`,
    [],
    'POST'
);
export const getHonestyNewDetail = forestFetchAction(
    `${TREE_API}/factoryAnalyseDetailInfo?factory={{name}}`,
    [getHonestyNewDetailOk],
    'GET'
);
export const getHonestyNewDetailModal = forestFetchAction(
    `${TREES_API}/honesty/new/?detail=true`,
    []
);
export const getHonestyNewTreetype = forestFetchAction(
    `${TREE_API}/factoryanalysebytreetype`,
    ''
);
export const postPositionData = forestFetchAction(
    `${TREE_API}/importLocations?user={{id}}`,
    [],
    'POST'
); //    √
export const getcarpackage = forestFetchAction(
    `${TREE_API}/carpacks`,
    []
);
export const getexportcarpackage = forestFetchAction(
    `${TREE_API}/exportcarpacks`,
    []
);
export const getNurserysByPack = forestFetchAction(
    `${TREE_API}/nurserysbypack`,
    []
);
export const getTreeLocations = forestFetchAction(
    `${TREE_API}/treelocations`,
    []
); // 获取同步后的苗木定位列表
export const getExportTreeLocations = forestFetchAction(
    `${TREE_API}/exporttreelocations`,
    []
); // 导出同步后的苗木定位列表

export const getSeedlingInfo = forestFetchAction(
    `${TREE_API}/remarktree?remark={{remark}}&pics={{pics}}&sxm={{sxm}}`,
    []
); // 修改备注信息

// 获取种植流程
export const getTreeflows = forestFetchAction(
    `${TREE_API}/treeflows`,
    []
);
// 获取打包车辆信息
export const getCarpackbysxm = forestFetchAction(
    `${TREE_API}/carpackbysxm/{{sxm}}`,
    []
);
// 获取树木现场种植的信息
export const getTreeMess = forestFetchAction(
    `${TREE_API}/tree/{{sxm}}`,
    []
);
// 获取树木定位信息
export const getTreeLocationCoord = forestFetchAction(
    `${TREE_API}/locationcoord?sxm={{sxm}}`,
    [], 'GET'
);

export const postForsetPic = myFetch(
    `${UPLOAD_API}?filetype=leader`,
    [],
    'POST'
);
export const clearTreeData = forestFetchAction(
    `${TREE_API}/cleartreedata`,
    [],
    'GET'
);

// 栽植、未栽植数量统计
export const getTreePlanting = forestFetchAction(
    `${TREE_API}/treestat4pie`,
    []
);

// 定位、未定位数量统计，用于饼图
export const getLocationStat = forestFetchAction(
    `${TREE_API}/locationstat4pie`,
    []
);

// 按树种统计栽植量
export const getStatByTreetype = forestFetchAction(
    `${TREE_API}/statbytreetype`,
    []
);

// 获取死亡记录或结缘筛选记录
export const getTreeStatuss = forestFetchAction(
    `${TREE_API}/treestatuss`,
    []
);
// 获取标段，小班或者细班的定位量
export const getLocationStatBySpecfield = forestFetchAction(
    `${TREE_API}/locationstatbyspecfield`,
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
    `${TREE_API}/nursersourcestat?section={{section}}&regioncode={{regioncode}}&etime={{etime}}`,
    []
);
export const getTreeEntrance = forestFetchAction(
    `${TREE_API}/nurserystat?`,
    []
);
// 用户分析用户统计
export const getUserStat = forestFetchAction(
    `${TREE_API}/userstat`,
    []
);
// 用户分析新增用户统计
export const getNewUserStat = forestFetchAction(
    `${TREE_API}/newuserstat`,
    []
);
// 用户分析活跃用户统计
export const getActivityUserStat = forestFetchAction(
    `${TREE_API}/activityuserstat`,
    []
);
// 用户分析用户按标段统计
export const getSectionUserStat = forestFetchAction(
    `${TREE_API}/sectionuserstat`,
    []
);
// 根据细班信息获取树种列表
export const getTreetypeByThinclass = forestFetchAction(
    `${ROUTE_API}/thinclassplans`,
    []
);

export const getTreearea = forestFetchAction(`${ROUTE_API}/thinclasses?`, [], 'GET'); // 获取细班详情

// 苗木来源地分析苗圃总览 苗圃基地、供应商数据统计
export const getNurseryBaseStat = forestFetchAction(
    `${TREE_API}/nurserybasestat`,
    []
);
// 苗木来源地分析苗圃总览 苗圃基地进场统计
export const getNurseryEnterStat = forestFetchAction(
    `${TREE_API}/nurseryinstatbynurserybase`,
    []
);
// 苗木来源地分析苗圃总览 供应商苗木进场统计
export const getSupplierEnterStat = forestFetchAction(
    `${TREE_API}/nurseryinstatbysupplier`,
    []
);
// 苗木来源地分析苗圃总览 苗圃基地退苗统计
export const getNurseryBackStat = forestFetchAction(
    `${TREE_API}/nurserybackstatbynurserybase`,
    []
);
// 苗木来源地分析苗圃总览 供应商苗木退苗统计
export const getSupplierBackStat = forestFetchAction(
    `${TREE_API}/nurserybackstatbysupplier`,
    []
);
// 获取苗圃列表
export const getNurseryListOK = createAction(`${ID}_getNurseryList`);
export const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases`, [], 'GET', []);

// 获取供应商列表
export const getSupplierListOK = createAction(`${ID}_getSupplierList`);
export const getSupplierList = forestFetchAction(`${SYSTEM_API}/suppliers`, [], 'GET', []);
// 数据维护
// 修改苗圃信息
export const putChangeNurseryInfoInCar = forestFetchAction(`${TREE_API}/batchnursery`, [], 'PUT', []);
// 修改车辆信息
export const putChangCarPackInfo = forestFetchAction(`${TREE_API}/carpack`, [], 'PUT', []);
// 车辆包合并
export const putMergeCarPack = forestFetchAction(`${TREE_API}/packmerge`, [], 'PUT', []);
// 车辆包内苗木移动车辆包内苗木移动
export const putMoveTreeInCar = forestFetchAction(`${TREE_API}/packnurserymove`, [], 'PUT', []);
// 修改现场测量信息
export const putChangeLocInfo = forestFetchAction(`${TREE_API}/batchtree`, [], 'PUT', []);
// 删除车辆包
export const deleteCarPack = forestFetchAction(`${TREE_API}/carpack/{{id}}`, [], 'DELETE', []);
// 导出苗木死亡信息
export const exportEcporttreestatuss = forestFetchAction(`${TREE_API}/ecporttreestatuss`, [], 'GET', []);

/**
 * 数字化验收
 * actions
 */
// 获取数字化验收列表
export const getDigitalAcceptList = forestFetchAction(
    `${TREE_API}/acceptances`,
    []
);
// 获取数字化验收重新发起申请流程列表
export const getWfreacceptanceList = forestFetchAction(
    `${TREE_API}/wfreacceptances`,
    []
);
// 获取数字化验收重新发起申请流程详情
export const getWfreacceptanceByID = forestFetchAction(
    `${TREE_API}/wfreacceptance/{{id}}`,
    []
);
// 删除数字化验收重新发起申请流程
export const deleteWfreacceptance = forestFetchAction(
    `${TREE_API}/wfreacceptance/{{id}}`,
    [], 'DELETE'
);
// 获取数字化验收详情
export const getDigitalAcceptDetail = forestFetchAction(
    `${TREE_API}/acceptancedetails`,
    []
);

// 获取苗木质量验收结果列表
export const getMQulityCheckList = forestFetchAction(
    `${TREE_API}/qualitytrees`,
    []
);
// 获取土球质量验收结果列表
export const getTQulityCheckList = forestFetchAction(
    `${TREE_API}/samplingnurserys`,
    []
);
// 获取苗木(栽植/支架/浇水)验收结果列表
export const getZZJQulityCheckList = forestFetchAction(
    `${TREE_API}/patrolevents`,
    []
);
// 获取苗木(栽植/支架/浇水)验收数量
export const getAcceptAnceEventStat = forestFetchAction(
    `${TREE_API}/acceptanceeventstat`,
    []
);
// 大数据验收结果列表
export const getBigDataCheckList = forestFetchAction(
    `${TREE_API}/trees`,
    []
);
// 数字化验收导出表格数据
export const getExportAcceptList = forestFetchAction(`${TREE_API}/exportacceptances`, [], 'GET', []);
// 数字化验收导出验收单
export const getExportAcceptReport = forestFetchAction(`${DOCEXPORT_API}?action=acceptance&acceptancedetailid={{acceptancedetailid}}`, [], 'GET', []);
// 获取标段对应的公司名称和项目经理
export const getUnitMessageBySection = forestFetchAction(`${TREE_API}/sections`, [], 'GET', []);
// 获取地图对应图层信息
export const postMapImage = forestFetchAction(`${ROUTE_API}/mapimage`, [], 'POST', []);
// 获取地图对应图层信息
export const postAreaAcceptanceMapImage = forestFetchAction(`${ROUTE_API}/areaacceptancemapimage`, [], 'POST', []);
// 获取第十项信息
export const getAcceptanceThinclasses = forestFetchAction(`${ROUTE_API}/acceptancethinclasses`, [], 'GET', []);
// 获取第十一项信息
export const getLastAcceptanceResult = forestFetchAction(`${TREE_API}/lastacceptanceresult`, [], 'GET', []);

// 辅助验收模块
export const getSupervisorUsersOK = createAction(`${ID}获取监理用户列表`);
export const getSupervisorUsers = createFetchAction(`${SYSTEM_API}/users`, [getSupervisorUsersOK], 'GET');
// 面积验收施工提交
export const postAreaAccept = forestFetchAction(`${ROUTE_API}/acceptancethinclass`, [], 'POST', []);

// 数字化验收重新发起验收流程申请
export const postWfreAcceptance = forestFetchAction(
    `${TREE_API}/wfreacceptance`,
    [], 'POST'
);
// 数字化验收重新发起验收流程监理、业主审核
export const postCheckWfreAcceptance = forestFetchAction(
    `${TREE_API}/checkwfreacceptance`,
    [], 'POST'
);

// 死亡苗木信息
// 获取死亡苗木信息
export const getDieTreesData = forestFetchAction(
    `${TREE_API}/dietrees`,
    []
);
// 导出死亡苗木列表
export const getExportDieTree = forestFetchAction(
    `${TREE_API}/exportDieTree`,
    []
);
// 车辆包新增
export const postAddCarPack = forestFetchAction(`${TREE_API}/carpack`, [], 'POST', []);

// 竣工图导出
export const getExportPipeDrawing = forestFetchAction(`${DOCEXPORT_API}/?action=pipedrawing`, []);
// 竣工图坐标数据查看
export const postPipeCoordinate = createFetchAction(`${TREEPIPE_API}/pipe/query`, [], 'POST', []);
// 上传附件
export const uploadFileHandler = myFetch(`${base}/OSSUploadHandler.ashx?filetype=news`, [], 'POST');
// 移植信息查看移植后信息
export const getTransplantLocMess = forestFetchAction(`${TREE_API}/trees`, []);
// 移植信息查看移植前信息
export const getTransplantTransMess = forestFetchAction(`${TREE_API}/treetransplants`, []);
export const actions = {
    exportEcporttreestatuss,
    getTotalSat,
    getTreeLocations,
    getExportTreeLocations,
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
    getWfreacceptanceList,
    getWfreacceptanceByID,
    deleteWfreacceptance,
    postWfreAcceptance,
    postCheckWfreAcceptance,

    getDigitalAcceptDetail,
    getUserStat,
    getNewUserStat,
    getActivityUserStat,
    getSectionUserStat,
    getTQulityCheckList,
    getZZJQulityCheckList,
    getAcceptAnceEventStat,
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
    deleteCarPack,
    getUnitMessageBySection,
    getExportAcceptList,
    getExportAcceptReport,
    getBigDataCheckList,
    postMapImage,
    postAreaAcceptanceMapImage,
    getAcceptanceThinclasses,
    getLastAcceptanceResult,
    getDieTreesData,
    getExportDieTree,
    getSupervisorUsersOK,
    getSupervisorUsers,
    postAreaAccept,
    postAddCarPack,
    getExportPipeDrawing,
    postPipeCoordinate,
    getTransplantLocMess,
    getTransplantTransMess
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
        if (payload && payload.content && payload.content instanceof Array) {
            return {
                ...state,
                supervisorUsersList: payload.content
            };
        } else {
            return {
                ...state,
                supervisorUsersList: ''
            };
        }
    }
}, {});
