import {actionsMap} from '_platform/store/util';
import itemReducer, {actions as itemActions}from './item';
import cellReducer, {actions as cellActions}from './cell';
import inspectionReducer, {actions as inspectionActions} from './inspection';
// import evaluateReducer, {actions as evaluateActions} from'./evaluate';
import cellsReducer, {actions as cellsActions} from './cells';
import monitoringReducer, {actions as monitoringActions} from './monitoring';
import defectReducer, {actions as defectActions} from './defect';
import subitemReducer, {actions as subitemActions} from './defect';



import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import {createFetchActionWithHeaders} from './fetchAction'
// 
import faithInfoReducer, {actions as faithActions} from './faithInfo';
import { FOREST_API,WORKFLOW_API,WORKFLOW_CODE} from '_platform/api';
const ID = 'faithanazly';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const changeNursery = createAction(`${ID}传递nurseryName`);
export const getHonestyNewDetailOk = createAction(`${ID}存储返回的详情`);
export const clearList = createAction(`${ID}清空列表`);
export const nurseryName = createAction(`${ID}供苗商名字`);


/*****************************院内************************/
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]); //    √
export const getQualityTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, []); //    √
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
export const getLittleBan = createFetchAction(`${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`, []); //    √
export const getTasksList = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}&&creator={{creator}}&&subject_littleban__contains={{littleban}}&&subject_thinban__contains={{thinban}}&&subject_number__contains={{number}}&&status={{status}}&&real_start_time_begin={{real_start_time_begin}}&&real_start_time_end={{real_start_time_end}}&&subject_fenxiang__contains={{fenxiang}}`, [], 'GET');
export const deleteTasksList = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`, [], 'DELETE');
export const gettreetype = createFetchAction(`${FOREST_API}/tree/treetypesbyno`, []);
export const getfactoryAnalyse = createFetchAction(`${FOREST_API}/tree/factoryAnalyse`, []);
export const getnurserys = createFetchAction(`${FOREST_API}/tree/nurserys`, []);
export const getNurserysTree = createFetchAction(`${FOREST_API}/tree/treenurserys`, []);
export const getqueryTree = createFetchAction(`${FOREST_API}/tree/queryTree`, []);
export const getTreeList = createFetchAction(`${FOREST_API}/tree/treetypes`, []);
export const getexportFactoryAnalyseInfo = createFetchAction(`${FOREST_API}/tree/exportFactoryAnalyseInfo`, []);
export const getexportFactoryAnalyseDetailInfo = createFetchAction(`${FOREST_API}/tree/exportFactoryAnalyseDetailInfo`, []);
export const getexportFactoryAnalyse = createFetchAction(`${FOREST_API}/tree/exportFactoryAnalyse`, []);
export const getexportTree4Checker = createFetchAction(`${FOREST_API}/tree/exportTree4Checker`, []);
export const getexportTree4Supervisor = createFetchAction(`${FOREST_API}/tree/exportTree4Supervisor`, []);
export const getexportTree = createFetchAction(`${FOREST_API}/tree/exportTree`, []);
export const getexportNurserys = createFetchAction(`${FOREST_API}/tree/exportNurserys`, []);
export const getexportTreeNurserys = createFetchAction(`${FOREST_API}/tree/exportTreeNurserys`, []);

export const getNurserysCount = createFetchAction(`${FOREST_API}/tree/nurserys/count/`, []);
export const getNurserysCountFast = createFetchAction(`${FOREST_API}/tree/nurserys/count/fast/`, []);
export const getNurserysProgress = createFetchAction(`${FOREST_API}/tree/nurserys/progress/`, []);
export const getquality = createFetchAction(`${FOREST_API}/tree/treestat4qualitybysection`, []);
export const getreturn = createFetchAction(`${FOREST_API}/tree/treestat4qualitybytimeback`, []);
export const getreturnowner = createFetchAction(`${FOREST_API}/trees/return/owner/`, []);
export const getreturnsupervision = createFetchAction(`${FOREST_API}/trees/return/supervision/`, []);
export const getCount = createFetchAction(`${FOREST_API}/trees/count/`, []);
export const getTreesProgress = createFetchAction(`${FOREST_API}/trees/progress/`, []);
export const getCountSection = createFetchAction(`${FOREST_API}/trees/count/section/`, []);
export const getCountSmall = createFetchAction(`${FOREST_API}/trees/count/small/`, []);
export const getCountThin = createFetchAction(`${FOREST_API}/trees/count/thin/`, []);
export const getHonesty = createFetchAction(`${FOREST_API}/trees/honesty/`, []);
export const getHonestyNursery = createFetchAction(`${FOREST_API}/trees/honesty/nursery/`, []);
export const getHonestyNew = createFetchAction(`${FOREST_API}/tree/factoryAnalyseInfo`, []);
export const getHonestyNewSort = createFetchAction(`${FOREST_API}/trees/honesty/new/fast/?sort=true`, []);
export const postFile = createFetchAction(`${FOREST_API}/db/import_location/`, [], 'POST');
export const getHonestyNewDetail = createFetchAction(`${FOREST_API}/tree/factoryAnalyseDetailInfo?factory={{name}}`, [getHonestyNewDetailOk], 'GET');
export const getHonestyNewDetailModal = createFetchAction(`${FOREST_API}/trees/honesty/new/?detail=true`, []);
export const getHonestyNewTreetype = createFetchAction(`${FOREST_API}/tree/factoryanalysebytreetype`, '');
export const actions = {
    getTreeOK,
    getTree,
    setkeycode,
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
    getQualityTreeNodeList,
    getLittleBan,
    getWorkflowById,
    getTasksList,
    deleteTasksList
};

export default handleActions({
	[combineActions(...actionsMap(itemActions))]: (state = {}, action) => ({
		...state,
		item: itemReducer(state.item, action),
	}),
	[combineActions(...actionsMap(cellActions))]: (state , action) => {
		return {...state, cell:cellReducer(state.cell, action)}
	},
    [combineActions(...actionsMap(inspectionActions))]: (state = {}, action) => ({
		...state,
		inspection: inspectionReducer(state.inspection, action),
    }),
    // [combineActions(...actionsMap(evaluateActions))]: (state = {}, action) => ({
    //     ...state,
    //     evaluate: evaluateReducer(state.evaluate, action),
    // }),
    [combineActions(...actionsMap(cellsActions))]: (state = {}, action) => ({
        ...state,
        cells: cellsReducer(state.cells, action),
    }),
    [combineActions(...actionsMap(monitoringActions))]: (state = {}, action) => ({
        ...state,
        monitoring: monitoringReducer(state.monitoring, action),
    }),
    [combineActions(...actionsMap(defectActions))]: (state = {}, action) => ({
        ...state,
        defect: defectReducer(state.defect, action),
    }),
    [combineActions(...actionsMap(subitemActions))]: (state = {}, action) => ({
        ...state,
        subitem: subitemReducer(state.subitem, action),
    }),
    [getTreeOK]: (state, {payload}) => {
        return {
            ...state,
            treeLists: [payload]
        }
    },
    [setkeycode]: (state, {payload}) => {
        return {
            ...state,
            keycode: payload
        }
    },
    [combineActions(...actionsMap(faithActions))]: (state = {}, action) => ({
        ...state,
        faith: faithInfoReducer(state.faith, action),
    }),

    [getHonestyNewDetailOk]: (state, {payload}) => ({
        ...state,
        honestyList: payload
    }),
    [clearList]: (state, {payload}) => ({
        ...state,
        honestyList: payload
    }),

    [nurseryName]: (state, {payload}) => ({
        ...state,
        nurseryName: payload
    })
}, {});
