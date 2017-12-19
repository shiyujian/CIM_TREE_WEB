import { handleActions, combineActions, createAction } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { actionsMap } from '_platform/store/util';
import { SAFETY_MONITOR,SERVICE_API,USER_API } from '_platform/api';

const postSchemes = createFetchAction(`${SAFETY_MONITOR}/monitor/schemes/`, [], 'POST');
const getSchemes = createFetchAction(`${SAFETY_MONITOR}/monitor/schemes/`, [], 'GET');
const patchSchemes = createFetchAction(`${SAFETY_MONITOR}/monitor/scheme/{{pk}}/`,[],'PATCH');
const deleteSchemes = createFetchAction(`${SAFETY_MONITOR}/monitor/scheme/{{pk}}/`,[],'DELETE');
const getWorkpackagesByCode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [], 'GET');
//const getUserInfoById = createFetchAction(`${USER_API}/users/{{id}}/`,[],'GET');
const getComByOrgCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/?reverse=true`,[],'GET');

//监测项目
const getMonitorType = createFetchAction(`${SAFETY_MONITOR}/monitor/types/`,[],"GET");
const postMonitorType = createFetchAction(`${SAFETY_MONITOR}/monitor/types/`,[],"POST");
const postMonitorTypes = createFetchAction(`${SAFETY_MONITOR}/monitor/types-import/`,[],"POST");
const deleteMonitorType = createFetchAction(`${SAFETY_MONITOR}/monitor/type/{{pk}}/`,[],"DELETE");
const patchMonitorType = createFetchAction(`${SAFETY_MONITOR}/monitor/type/{{pk}}/`,[],"PATCH");
//测点
const getMonitorNodes = createFetchAction(`${SAFETY_MONITOR}/monitor/nodes/`,[],"GET");
const postMonitorNode = createFetchAction(`${SAFETY_MONITOR}/monitor/nodes/`,[],"POST");
const postMonitorNodes = createFetchAction(`${SAFETY_MONITOR}/monitor/nodes-import/`,[],"POST");
const getMonitorNodeInfo = createFetchAction(`${SAFETY_MONITOR}/monitor/node/{{pk}}/`,[],"GET");
const deleteMonitorNode = createFetchAction(`${SAFETY_MONITOR}/monitor/node/{{pk}}/`,[],"DELETE");
const patchMonitorNode = createFetchAction(`${SAFETY_MONITOR}/monitor/node/{{pk}}/`,[],"PATCH");
const setDepthArray = createAction("设置深度数组");
const setTableArray = createAction("设置表格数组");

//监测数据
const getMonitorValues = createFetchAction(`${SAFETY_MONITOR}/monitor/values/`,[],"GET");
const postMonitorValue = createFetchAction(`${SAFETY_MONITOR}/monitor/values/`,[],"POST");
const postMonitorValues = createFetchAction(`${SAFETY_MONITOR}/monitor/values-import/`,[],"POST");
const getMonitorValueInfo = createFetchAction(`${SAFETY_MONITOR}/monitor/value/{{pk}}/`,[],"GET");

//获取想要的信息
const getDateList = createFetchAction(`${SAFETY_MONITOR}/monitor/value-stat/?field=date`,[],"GET");

export const actions = {
	postSchemes,
	getSchemes,
	patchSchemes,
	getWorkpackagesByCode,
	getComByOrgCode,
	deleteSchemes,
	getMonitorType,
	postMonitorType,
	postMonitorTypes,
	getMonitorNodes,
	postMonitorNode,
	postMonitorNodes,
	getMonitorNodeInfo,
	getMonitorValues,
	postMonitorValue,
	postMonitorValues,
	getMonitorValueInfo,
	setDepthArray,
	deleteMonitorType,
	patchMonitorType,
	deleteMonitorNode,
	patchMonitorNode,
	setTableArray,
	getDateList
};

export default handleActions({
	[setDepthArray]:(state, {payload}) => {
        return {
            ...state,
            deepArray: payload
        }
	},
	[setTableArray]:(state, {payload}) => {
        return {
            ...state,
            tableArray: payload
        }
	}
}, {});
