import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

export const ID = 'unitpro';
export const getProjectAcOK = createAction(`${ID}PROJECT获取项目列表`);
export const getProjectAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=1`, [getProjectAcOK]);
export const searchProjectAcOK = createAction(`${ID}PROJECT搜索项目`);
export const searchProjectAc = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_PJ`, [searchProjectAcOK]);
//PROJECT搜索栏切换开关
export const searchToggleAc = createAction(`${ID}PROJECT搜索栏切换开关`);
//PROJECT获取项目审批人员信息列表
export const getExaminesAcOK = createAction(`${ID}PROJECT获取项目审批人员信息列表`);
export const getExaminesAc = createFetchAction(`${USER_API}/users/?organization={{org}}`, [getExaminesAcOK]);
//新增项目工程
export const postProjectAc = createFetchAction(`${SERVICE_API}/projects/`, [],'POST');
//编辑项目工程
export const putProjectAc = createFetchAction(`${SERVICE_API}/projects/code/{{code}}/`, [],'PUT');
export const getLocationAcOk = createAction(`${ID}获取location根`);
//获取根location
export const getLocationAc = createFetchAction(`${SERVICE_API}/loc-tree/?depth=1`,[getLocationAcOk] , "GET");
// 新增location对象
export const postLocationAc = createFetchAction(`${SERVICE_API}/locations/`, [], "POST");
// 删除location对象
export const deleteLocationAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, [], "DELETE")
//删除项目工程
export const deleteProjectAc = createFetchAction(`${SERVICE_API}/projects/code/{{code}}/?this=true`, [],'DELETE');
//PROJECT设置当前选中的项目工程
export const setSelectProjectAc = createAction(`${ID}PROJECT设置当前选中的项目工程`);
//PROJECT新建或编辑区域的modal
export const toggleModalAc = createAction(`${ID}PROJECT新建或编辑区域的modal`);
//PROJECT设置上传的文件列表
export const postUploadFilesAc = createAction(`${ID}PROJECT设置上传的文件列表`);

//创建施工包流程
export const postInstance = createFetchAction(`${WORKFLOW_API}/instance/`, [],'POST');
//提交要下一步审批
export const postLogEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [],'POST');
//PROJECT获取流程详情
export const getInstanceAcOK = createAction(`${ID}PROJECT获取流程详情`);
export const getInstanceAc = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`, [getInstanceAcOK]);
//PROJECT设置编码系统相关的信息
export const setBuildNameAc = createAction(`${ID}PROJECT设置编码系统相关的信息`);

//PROJECT获取文件目录树
export const getDirRootAcOK = createAction(`${ID}PROJECT获取文件目录树`);
export const getDirRootAc = createFetchAction(`${SERVICE_API}/dir-tree/code/${window.DeathCode.DATUM_ENGINEERING}/`, [getDirRootAcOK]);
//生成根目录下的项目
export const postDirAc = createFetchAction(`${SERVICE_API}/directories/`, [],'POST');
//删除文档目录
export const delDirAc = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`, [],'DELETE');
// console.log('window',window)
export const actions = {
	getProjectAcOK,
	getProjectAc,
	searchProjectAcOK,
	searchProjectAc,
	searchToggleAc,
	getExaminesAcOK,
	getExaminesAc,
	postProjectAc,
	putProjectAc,
	deleteProjectAc,
	setSelectProjectAc,
	toggleModalAc,
	postUploadFilesAc,
	postInstance,
	postLogEvent,
	getInstanceAcOK,
	getInstanceAc,
	setBuildNameAc,
	getDirRootAcOK,
	getDirRootAc,
	postDirAc,
	delDirAc,
	getLocationAcOk,
	getLocationAc,
	postLocationAc,
	deleteLocationAc
};

export default handleActions({
	[getProjectAcOK]: (state, {payload}) => ({
		...state,
		projectList: payload.children || [],
		// selectProject:!state.selectProject ? `${payload.children[0].code}--${payload.children[0].name}` : state.selectProject,
		parentProject:payload,
	}),
	[searchProjectAcOK]: (state, {payload}) => ( {
		...state,
		selectList: payload.result
	}),
	[searchToggleAc]: (state, {payload}) => ( {
		...state,
		searchVisible: payload
	}),
	[getExaminesAcOK]: (state, {payload}) => ( {
		...state,
		examines: payload
	}),
	[setSelectProjectAc]: (state, {payload}) => ( {
		...state,
		selectProject: payload
	}),
	[toggleModalAc]: (state, {payload}) => ( {
		...state,
		toggleData: payload
	}),
	[postUploadFilesAc]: (state, {payload}) => ( {
		...state,
		fileList: payload
	}),
	[getInstanceAcOK]: (state, {payload}) => ( {
		...state,
		instanceDetail: payload.history
	}),
	[setBuildNameAc]: (state, {payload}) => ( {
		...state,
		buildName: payload
	}),
	[getDirRootAcOK]: (state, {payload}) => ( {
		...state,
		dirRootInfo: payload
	}),
	[getLocationAcOk]: (state, {payload}) => ( {
		...state,
		locRootInfo: payload
	}),
}, {});
