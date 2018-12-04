import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
//
import { FOREST_API } from '_platform/api';
const ID = 'ScheduleDisplay';

export const setkeycode = createAction(`${ID}_setkeycode`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const changeNursery = createAction(`${ID}传递nurseryName`);

/** ***************************院内************************/
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [
    getTreeOK
]); //    √
export const gettreetype = createFetchAction(
    `${FOREST_API}/tree/nurserystat?`,
    []
);
export const getfactoryAnalyse = createFetchAction(
    `${FOREST_API}/trees/analyse/`,
    []
);
export const getnurserys = createFetchAction(
    `${FOREST_API}/tree/nurserys/`,
    []
);
export const getqueryTree = createFetchAction(
    `${FOREST_API}/tree/queryTree`,
    []
);
export const getexportTree = createFetchAction(
    `${FOREST_API}/tree/xlsx/`,
    [],
    'POST'
);
export const getNurserysCount = createFetchAction(
    `${FOREST_API}/tree/nurserys/count/`,
    []
);
export const getfactory = createFetchAction(
    `${FOREST_API}/tree/factoryanalysebytreetype`,
    []
);
export const gettreeevery = createFetchAction(
    `${FOREST_API}/tree/treetypes`,
    []
);
export const nowmessage = createFetchAction(
    `${FOREST_API}/tree/queryTree?page=1&size=5`,
    []
);

export const getTotalSat = createFetchAction(
    `${FOREST_API}/tree/totalstat`,
    []
);
export const gettreetypeAll = createFetchAction(
    `${FOREST_API}/tree/treestat`,
    []
);
export const gettreetypeSection = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=Section`,
    []
);
export const gettreetypeSmallClass = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=SmallClass`,
    []
);
export const gettreetypeThinClass = createFetchAction(
    `${FOREST_API}/tree/treestatbyspecfield?stattype=ThinClass`,
    []
);
export const getSmallClassList = createFetchAction(
    `${FOREST_API}/tree/wpunit4apps?parent={{no}}`,
    []
);

export const progressdata = createFetchAction(
    `${FOREST_API}/tree/progressstat?`,
    []
);
export const progressalldata = createFetchAction(
    `${FOREST_API}/tree/progresss?`,
    []
);
export const progressstat4pie = createFetchAction(
    `${FOREST_API}/tree/progressstat4pie?`,
    []
);
// 查询计划栽植量接口
export const getTreedayplans = createFetchAction(
    `${FOREST_API}/tree/treedayplans`,
    []
);
// 查询实际栽植量接口
export const getTreetotalstatbyday = createFetchAction(
    `${FOREST_API}/tree/treetotalstatbyday`,
    []
);
// 查询计划任务量
export const getTreesectionplans = createFetchAction(
    `${FOREST_API}/tree/treesectionplans`,
    []
);

export const actions = {
    getTreeOK,
    getTree,
    setkeycode,
    gettreetype,
    getSmallClassList,
    getTotalSat,
    progressalldata,
    getTreedayplans,
    getTreetotalstatbyday,
    getTreesectionplans
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
        }
    },
    {}
);
