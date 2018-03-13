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
export const gettreetype = createFetchAction(`${FOREST_API}/tree/nurserystat?`, []);
export const getfactoryAnalyse = createFetchAction(`${FOREST_API}/trees/analyse/`, []);
export const getnurserys = createFetchAction(`${FOREST_API}/tree/nurserys/`, []);
export const getqueryTree = createFetchAction(`${FOREST_API}/tree/queryTree`, []);
export const getexportTree = createFetchAction(`${FOREST_API}/tree/xlsx/`, [],'POST');
export const getNurserysCount = createFetchAction(`${FOREST_API}/tree/nurserys/count/`, []);
export const getNurserysCountFast = createFetchAction(`${FOREST_API}/tree/nurserystat?no=P009`, []);
export const getfactory = createFetchAction(`${FOREST_API}/tree/factoryanalysebytreetype`, []);
export const gettreeevery = createFetchAction(`${FOREST_API}/tree/treetypes`, []);
export const nowmessage = createFetchAction(`${FOREST_API}/tree/queryTree?page=1&size=5`,[]);




export const getTotalSat = createFetchAction(`${FOREST_API}/tree/totalstat?stattype={{statType}}`, []);
export const gettreetypeAll = createFetchAction(`${FOREST_API}/tree/treestat`, []);
export const gettreetypeSection = createFetchAction(`${FOREST_API}/tree/treestatbyspecfield?stattype=Section`, []);
export const gettreetypeSmallClass = createFetchAction(`${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`, []);
export const gettreetypeThinClass = createFetchAction(`${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`, []);
export const getSmallClassList = createFetchAction(`${FOREST_API}/tree/wpunit4apps?parent={{no}}`, []);




export const progressdata = createFetchAction(`${FOREST_API}/tree/progressstat?`,[]);
export const progressalldata = createFetchAction(`${FOREST_API}/tree/progresss?`,[]);
export const progressstat4pie = createFetchAction(`${FOREST_API}/tree/progressstat4pie?`,[]);




export const actions = {
	getTreeOK,
	getTree,
	setkeycode,
	gettreetype,
	getSmallClassList,
	getTotalSat
	
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
 

}, {});
