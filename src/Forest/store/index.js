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
export const getCountSection = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=Section`,
    []
);
export const getCountSmall = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`,
    []
);
export const getCountThin = forestFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`,
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
export const getNurseryFromData = createFetchAction(
    `${FOREST_API}/tree/nursersourcestat?section={{section}}&regioncode={{regioncode}}&etime={{etime}}`,
    []
);
export const getTreeEntrance = forestFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);

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
export const getDigitalAcceptUserList = forestFetchAction(
    `${USER_API}/users/?is_active=true`,
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

export const actions = {
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
    getYSResultList,
    getTreetypeByThinclass
    getUserStat,
    getNewUserStat,
    getActivityUserStat,
    getSectionUserStat
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
    })
}, {});
