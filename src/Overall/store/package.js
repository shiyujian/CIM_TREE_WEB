import {createAction, handleActions, combineActions} from 'redux-actions';
// import createFetchAction from './fetchAction';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API,WORKFLOW_API} from '_platform/api';

//新建modal框的显示与影藏
export const toggleModal = createAction('新建modal框的显示与影藏');
//获取到子单位工程tree数据
export const getUnitTreeOK = createAction('获取到子单位工程tree数据');
export const getUnitTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=4`, [getUnitTreeOK]);
//设置当前选中的子单位工程
export const setSelectedUnit = createAction('设置当前选中的子单位工程');
//设置新建的分部子分部的数据
export const setPtrTree = createAction('设置新建的分部子分部的数据');
//设置当前选中的分部或子分部工程
export const setSelectedPtr = createAction('设置当前选中的分部或子分部工程');

//设置新建的分项的数据
export const setItmTree = createAction('设置新建的分项的数据');
//设置当前选中的分部或子分部工程
export const setSelectedItm = createAction('设置当前选中的分项工程');
//设置table的数组值
export const setTables = createAction('设置table的数组值');
//检查新的CODE是否已经存在
export const checkCodeIsActive = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, []);

//获取单位工程或者子单位工程的施工包数据
export const getPackagesOK = createAction('获取单位工程或者子单位工程的施工包数据');
export const getPackages = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&depth=3`, [getPackagesOK]);

//创建施工包流程
export const postInstance = createFetchAction(`${WORKFLOW_API}/instance/`, [],'POST');
//指派执行人
export const putInstanceUser = createFetchAction(`${WORKFLOW_API}/instance/{{ppk}}/state/{{pk}}/`, [],'PUT');
//启动流程
export const putInstanceStart = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/start/`, [],'PUT');

//获取施工包填报的详细信息
export const getInstanceOK = createAction('获取施工包填报的详细信息');
export const getInstance = createFetchAction(`${WORKFLOW_API}/instance/{{id}}`, [getInstanceOK]);


//创建新增的施工包
export const postPackage = createFetchAction(`${SERVICE_API}/workpackages/`, [],'POST');
//修改施工包是否已发起填报通知
export const putPackage = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [],'PUT');
//提交要下一步审批
export const postLogEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [],'POST');
//更改流程中存储的subject数据
export const postSubject = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/subject/`, [],'POST');

//设置当前选中的项目
export const setSelectedProject = createAction('设置当前选中的项目');
//获取当前点击的tree节点的信息
// export const getTreeNodeOK = createAction('获取当前点击的tree节点的信息');
// export const getTreeNode = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [getTreeNodeOK]);
//获取施工单位的人员信息列表
export const getBuildersOK = createAction('获取施工单位的人员信息列表');
export const getBuilders = createFetchAction(`${USER_API}/users/`, [getBuildersOK]);
//获取审批人员信息列表
export const getExaminesOK = createAction('获取审批人员信息列表');
export const getExamines = createFetchAction(`${USER_API}/users/`, [getExaminesOK]);
//流程抄送
export const postCarbonCopy = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/carbon-copy/`, [],'POST');
//获取模板下载地址
export const getTemplates = createFetchAction(`${SERVICE_API}/excel/templates/`, []);
export const actions = {
	toggleModal,
	getUnitTreeOK,
	getUnitTree,
	setSelectedUnit,
	setPtrTree,
	setSelectedPtr,
	setItmTree,
	setSelectedItm,
	setTables,
	checkCodeIsActive,
	getPackagesOK,
	getPackages,
	postInstance,
	putInstanceUser,
	putInstanceStart,
	getInstanceOK,
	getInstance,
	postPackage,
	putPackage,
	postLogEvent,
	postSubject,
	setSelectedProject,
	getBuildersOK,
	getBuilders,
	getExaminesOK,
	getExamines,
	postCarbonCopy,
	getTemplates,
	// getTreeNodeOK,
	// getTreeNode,
};
export default handleActions({
	[toggleModal]: (state, {payload}) => ( {
		...state,
		toggleData: payload
	}),
	[getUnitTreeOK]: (state, {payload}) => ( {
		...state,
		unitTree: payload.children[0].children || []
	}),
	[setSelectedUnit]: (state, {payload}) => ( {
		...state,
		selectedUnit: payload
	}),
	[setPtrTree]: (state, {payload}) => ( {
		...state,
		ptrTreeData: payload
	}),
	[setSelectedPtr]: (state, {payload}) => ( {
		...state,
		selectedPtr: payload
	}),
	[setItmTree]: (state, {payload}) => ( {
		...state,
		itmTreeData: payload
	}),
	[setSelectedItm]: (state, {payload}) => ( {
		...state,
		selectedItm: payload
	}),
	[setTables]: (state, {payload}) => ( {
		...state,
		tablesData: payload
	}),
	[getPackagesOK]: (state, {payload}) => ( {
		...state,
		packagesData: payload
	}),
	[getInstanceOK]: (state, {payload}) => ( {
		...state,
		instanceDetail: payload
	}),
	[setSelectedProject]: (state, {payload}) => ( {
		...state,
		selectedProject: payload
	}),
	[getBuildersOK]: (state, {payload}) => ( {
		...state,
		builders: payload
	}),
	[getExaminesOK]: (state, {payload}) => ( {
		...state,
		examines: payload
	}),
	// [getTreeNodeOK]: (state, {payload}) => ( {
	// 	...state,
	// 	treeNodeDetail: payload
	// }),
}, {});
