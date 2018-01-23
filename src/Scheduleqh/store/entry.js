import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import {createFetchActionWithHeaders} from './fetchAction'
// 
import faithInfoReducer, {actions as faithActions} from './faithInfo';
import { FOREST_API,WORKFLOW_API} from '_platform/api';
import {actionsMap} from '_platform/store/util';
const ID = 'entry';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const changeNursery = createAction(`${ID}传递nurseryName`);


/*****************************院内************************/
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]); //    √
// export const gettreetype = createFetchAction(`${FOREST_API}/tree-types/`, []);
export const gettreetype = createFetchAction(`${FOREST_API}/tree/nurserystat?no=P009{{etime}}`, []);

export const gettreetype1 = createFetchAction(`${FOREST_API}/tree/treestat?no=P009`, []);
export const gettreetype2 = createFetchAction(`${FOREST_API}/tree/treestatbyspecfield?stattype=Section`, []);

export const gettreetype3 = createFetchAction(`${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass{{params}}`, []);
export const gettreetype4 = createFetchAction(`${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass{{params}}`, []);

export const getfactoryAnalyse = createFetchAction(`${FOREST_API}/trees/analyse/`, []);
export const getnurserys = createFetchAction(`${FOREST_API}/tree/nurserys/`, []);
export const getqueryTree = createFetchAction(`${FOREST_API}/tree/queryTree`, []);
export const getexportTree = createFetchAction(`${FOREST_API}/tree/xlsx/`, [],'POST');
export const getTreeList = createFetchAction(`${FOREST_API}/trees/list/`, []);
export const getNurserysCount = createFetchAction(`${FOREST_API}/tree/nurserys/count/`, []);
// export const getNurserysCountFast = createFetchAction(`${FOREST_API}/tree/nurserys/count/fast/`, []);
export const getNurserysCountFast = createFetchAction(`${FOREST_API}/tree/nurserystat?no=P009`, []);
export const getfactory = createFetchAction(`${FOREST_API}/tree/factoryanalysebytreetype`, []);
export const gettreeevery = createFetchAction(`${FOREST_API}/tree/treetypesbyno`, []);



export const getNurserysProgress = createFetchAction(`${FOREST_API}/tree/nurserys/progress/`, []);
export const getquality = createFetchAction(`${FOREST_API}/trees/quality/`, []);
export const getreturn = createFetchAction(`${FOREST_API}/trees/return/`, []);
export const getreturnowner = createFetchAction(`${FOREST_API}/trees/return/owner/`, []);
export const getreturnsupervision = createFetchAction(`${FOREST_API}/trees/return/supervision/`, []);
export const getCount = createFetchAction(`${FOREST_API}/trees/count/`, []);
export const getTreesProgress = createFetchAction(`${FOREST_API}/trees/progress/`, []);
export const getCountSection = createFetchAction(`${FOREST_API}/trees/count/section/`, []);
export const getCountSmall = createFetchAction(`${FOREST_API}/trees/count/small/`, []);
export const getCountThin = createFetchAction(`${FOREST_API}/trees/count/thin/`, []);
export const getHonesty = createFetchAction(`${FOREST_API}/trees/honesty/`, []);
export const getHonestyNursery = createFetchAction(`${FOREST_API}/trees/honesty/nursery/`, []);
export const getHonestyNew = createFetchAction(`${FOREST_API}/trees/honesty/new/fast/`, []);
export const getHonestyNewSort = createFetchAction(`${FOREST_API}/trees/honesty/new/fast/?sort=true`, []);
export const postFile = createFetchAction(`${FOREST_API}/db/import_location/`, [], 'POST');
export const getHonestyNewDetailOk = createAction(`${ID}存储返回的详情`);
export const getHonestyNewDetail = createFetchAction(`${FOREST_API}/trees/honesty/new/?nurseryname={{name}}&detail=true`, [getHonestyNewDetailOk], 'GET');
export const getHonestyNewDetailModal = createFetchAction(`${FOREST_API}/trees/honesty/new/?detail=true`, []);
export const getHonestyNewTreetype = createFetchAction(`${FOREST_API}/trees/honesty/nursery/treetype/`, '');
export const clearList = createAction(`${ID}清空列表`);
export const nurseryName = createAction(`${ID}供苗商名字`);
const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');
export const actions = {
	getTreeOK,
	getTree,
	setkeycode,
	gettreetype,
	getfactoryAnalyse,
	getnurserys,
	getqueryTree,
	getexportTree,
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
	getWorkflowById
};
export default handleActions({
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
