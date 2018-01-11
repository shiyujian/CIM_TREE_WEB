import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import receiveManagementReducer, {actions as receiveManagementActions} from './receiveManagement';
import inventoryManagementReducer, {actions as inventoryManagementActions} from './inventoryManagement';
import distributionManagementReducer, {actions as distributionManagementActions} from './distributionManagement';

export default handleActions({
	[combineActions(...actionsMap(receiveManagementActions))]: (state = {}, action) => ({
		...state,
		receiveManagement: receiveManagementReducer(state.receiveManagement, action),
	}),
	[combineActions(...actionsMap(inventoryManagementActions))]: (state = {}, action) => ({
		...state,
		inventoryManagement: inventoryManagementReducer(state.inventoryManagement, action),
	}),
	[combineActions(...actionsMap(distributionManagementActions))]: (state = {}, action) => ({
		...state,
		distributionManagement: distributionManagementReducer(state.distributionManagement, action),
	}),
}, {});