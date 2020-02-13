import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import treeManageReducer, {actions as treeManageActions} from './treeManage';
import nurseryManagementReducer, {actions as nurseryManagementActions} from './nurseryManagement';
import projectImageReducer, {actions as projectImageActions} from './projectImage';
import qrcodedistributeReducer, {actions as qrcodedistributeActions} from './qrcodedistribute';
// 人员进离场
import manEntranceAndDepartureReducer, { actions as manEntranceAndDepartureActions } from './ManMachine/manEntranceAndDeparture';
import machineEntranceAndDepartureReducer, { actions as machineEntranceAndDepartureActions } from './ManMachine/machineEntranceAndDeparture';
import manMachineGroupReducer, { actions as manMachineGroupActions } from './ManMachine/manMachineGroup';
import machineQRCodePrintReducer, { actions as machineQRCodePrintActions } from './ManMachine/machineQRCodePrint';
import faceRecognitionListReducer, { actions as faceRecognitionListActions } from './ManMachine/faceRecognitionList';
import faceRecognitionRecordReducer, { actions as faceRecognitionRecordActions } from './ManMachine/faceRecognitionRecord';
// 施工包管理
import constructionPackageReducer, { actions as constructionPackageActions } from './constructionPackage';

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
    }),
    // 人员进离场
    [combineActions(...actionsMap(manEntranceAndDepartureActions))]: (state = {}, action) => ({
        ...state,
        manEntranceAndDeparture: manEntranceAndDepartureReducer(state.manEntranceAndDeparture, action)
    }),
    [combineActions(...actionsMap(machineEntranceAndDepartureActions))]: (state = {}, action) => ({
        ...state,
        machineEntranceAndDeparture: machineEntranceAndDepartureReducer(state.machineEntranceAndDeparture, action)
    }),
    [combineActions(...actionsMap(manMachineGroupActions))]: (state = {}, action) => ({
        ...state,
        manMachineGroup: manMachineGroupReducer(state.manMachineGroup, action)
    }),
    [combineActions(...actionsMap(machineQRCodePrintActions))]: (state = {}, action) => ({
        ...state,
        machineQRCodePrint: machineQRCodePrintReducer(state.machineQRCodePrint, action)
    }),
    [combineActions(...actionsMap(faceRecognitionListActions))]: (state = {}, action) => ({
        ...state,
        faceRecognitionList: faceRecognitionListReducer(state.faceRecognitionList, action)
    }),
    [combineActions(...actionsMap(faceRecognitionRecordActions))]: (state = {}, action) => ({
        ...state,
        faceRecognitionRecord: faceRecognitionRecordReducer(state.faceRecognitionRecord, action)
    }),
    [combineActions(...actionsMap(constructionPackageActions))]: (state = {}, action) => ({
        ...state,
        constructionPackage: constructionPackageReducer(state.constructionPackage, action)
    })
}, {});
