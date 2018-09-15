import { handleActions, combineActions } from 'redux-actions';
import { actionsMap } from '_platform/store/util';
import seedlingSupplyReducer, { actions as seedlingSupplyActions } from './seedlingSupply';
import seedlingPurchaseReducer, { actions as seedlingPurchaseActions } from './seedlingPurchase';
import supplyReleaseReducer, { actions as supplyReleaseActions } from './supplyRelease';
import demandReleaseReducer, { actions as demandReleaseActions } from './demandRelease';

export default handleActions(
    {
        [combineActions(...actionsMap(seedlingSupplyActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            seedlingSupply: seedlingSupplyReducer(state.seedlingSupply, action)
        }),
        [combineActions(...actionsMap(seedlingPurchaseActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            seedlingPurchase: seedlingPurchaseReducer(state.seedlingPurchase, action)
        }),
        [combineActions(...actionsMap(supplyReleaseActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            supplyRelease: supplyReleaseReducer(state.supplyRelease, action)
        }),
        [combineActions(...actionsMap(demandReleaseActions))]: (
            state = {},
            action
        ) => ({
            ...state,
            demandRelease: demandReleaseReducer(state.demandRelease, action)
        })
    },
    {}
);
