import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import treeManageRducer, {actions as treeManageActions} from './treeManage';
import nurseryManagementRducer, {actions as nurseryManagementActions} from './nurseryManagement';
import projectImageRducer, {actions as projectImageActions} from './projectImage';

export default handleActions({
    [combineActions(...actionsMap(treeManageActions))]: (state = {}, action) => ({
        ...state,
        treeManage: treeManageRducer(state.treeManage, action)
    }),
    [combineActions(...actionsMap(nurseryManagementActions))]: (state = {}, action) => ({
        ...state,
        nurseryManagement: nurseryManagementRducer(state.nurseryManagement, action)
    }),
    [combineActions(...actionsMap(projectImageActions))]: (state = {}, action) => ({
        ...state,
        projectImage: projectImageRducer(state.projectImage, action)
    })
}, {});
