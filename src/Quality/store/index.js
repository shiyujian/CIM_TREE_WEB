import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import itemReducer, {actions as itemActions}from './item';
import cellReducer, {actions as cellActions}from './cell';
import inspectionReducer, {actions as inspectionActions} from './inspection';
// import evaluateReducer, {actions as evaluateActions} from'./evaluate';
import cellsReducer, {actions as cellsActions} from './cells';
import monitoringReducer, {actions as monitoringActions} from './monitoring';
import defectReducer, {actions as defectActions} from './defect';
import subitemReducer, {actions as subitemActions} from './defect';

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
}, {});
