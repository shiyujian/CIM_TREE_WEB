import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import treeManageReducer, {actions as treeManageActions} from './treeManage';
import nurseryManagementReducer, {actions as nurseryManagementActions} from './nurseryManagement';
import projectImageReducer, {actions as projectImageActions} from './projectImage';
import qrcodedistributeReducer, {actions as qrcodedistributeActions} from './qrcodedistribute';

export default handleActions({
    [combineActions(...actionsMap(treeManageActions))]: (state = {}, action) => ({
        ...state,
        treeManage: treeManageReducer(state.treeManage, action)
    }),
    [combineActions(...actionsMap(nurseryManagementActions))]: (state = {}, action) => ({
        ...state,
        nurseryManagement: nurseryManagementReducer(state.nurseryManagement, action)
    }),
    [combineActions(...actionsMap(projectImageActions))]: (state = {}, action) => ({
        ...state,
        projectImage: projectImageReducer(state.projectImage, action)
    }),
    [combineActions(...actionsMap(qrcodedistributeActions))]: (state = {}, action) => ({
        ...state,
        qrcodedistribute: qrcodedistributeReducer(state.qrcodedistribute, action)
    })
}, {});
