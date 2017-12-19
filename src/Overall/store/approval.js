import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { USER_API, SERVICE_API, WORKFLOW_API } from '_platform/api';

export const ID = 'OVERALL_Approval';
export const getUnitTreeOK = createAction(`${ID}_获取单位工程tree数据`);
export const getUnitTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=2`, [getUnitTreeOK]);
//设置当前选中的子单位工程
export const setSelectedUnit = createAction(`${ID}_设置当前选中的条目`);
//加载选定的数据
export const setSelectedBlock = createAction(`${ID}_设置当前选中的步骤块`)

//更新单位工程块引导数据 fixme
export const putCurrentWp = createFetchAction(
	`${SERVICE_API}/workpackages/code/{{code}}/`,
	'PUT');

//加载单位工程块引导数据 v1
export const getCurrentWpOK = createAction(`${ID}_加载单位工程数据`);
//获取单位工程块引导数据 v1
export const getCurrentWp = createFetchAction(
	`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,
	[getCurrentWpOK]
);

export const setBlockIndex = createAction(`${ID}_设置BlockIndex`);

//加载单位工程块引导数据 v2
export const getBlockIndexOK = createAction(`${ID}_获取单位工程数据成功`);
//获取单位工程块引导数据 v2
export const getBlockIndex = createFetchAction(
	`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,
	[getBlockIndexOK]
);

export const toggleBlockInfo = createAction(`${ID}_操控块信息面板`);
export const toggleMakePlan = createAction(`${ID}_设置-展示/关闭-发起计划面板`)


//----------------------------------------------------------
//-----------------------------流程-------------------------
export const postInstance = createFetchAction(`${WORKFLOW_API}/instance/`, [],'POST');
export const addNextWorker = createFetchAction(`${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`, [],'PUT');
export const startWorkFlow = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/start/`, [],'PUT');

//获取指定流程实例的详细信息
export const getInstanceOK = createAction(`${ID}_获取指定流程实例的详细信息`);
export const getInstance = createFetchAction(`${WORKFLOW_API}/instance/{{id}}`, [getInstanceOK]);
//提交任务
export const postLogEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [],'POST');
//更改流程中存储的subject数据
export const postSubject = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/subject/`, [],'POST');
export const getMissionOK = createAction(`${ID}_获取block任务`);
export const getMission = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&executor={{executor}}&code=TEMPLATE_022`,[getMissionOK]);
//------------------------------------------------------------

export const actions = {

	getUnitTreeOK,
	getUnitTree,
	setSelectedUnit,
	putCurrentWp,
	getCurrentWp,
	getCurrentWpOK,

	setBlockIndex,
	setSelectedBlock,

	getBlockIndexOK,
	getBlockIndex,

	toggleBlockInfo,
	toggleMakePlan,

	//-----流程-----
		postInstance,
		addNextWorker,
		startWorkFlow,
		getInstanceOK,
		getInstance,
		postLogEvent,
		postSubject,
		getMissionOK,
		getMission,
	//--------------
};

export default handleActions(
	{
		[getUnitTreeOK]: (state, { payload }) => ({
			...state,
			unitTree: payload.children || []
		}),
		[setSelectedUnit]: (state, { payload }) => ({
			...state,
			selectedUnit: payload
		}),
		[getCurrentWpOK]: (state, { payload }) => ({
			...state,
			currentWp: payload
		}),
		[setBlockIndex]: (state, { payload })=>({
			...state,
			blockIndex: payload
		}),
		[getBlockIndexOK]:(state, {payload})=>{
			return { 
				...state,
				blockIndex: payload.extra_params.blockIndex
			};
		},
		[toggleBlockInfo]:(state,{payload})=>({
			...state,
			toggleBlockInfoValue: payload
		}),

		[setSelectedBlock]:(state,{payload})=>({
			...state,
			selectedBlock: payload
		}),

		// [toggleMakePlan]:(state,{payload})=>({
		// 	...state,
		// 	toggleMakePlanValue: payload
		// }),

		//-----------流程------------
		[getInstanceOK]:(state,{payload})=>({
			...state,
			flowInstance: payload	
		}),
		[getMissionOK]:(state,{payload})=>({
			...state,
			blockMission: payload
		}),
		//---------------------------
	},
	{}
);
