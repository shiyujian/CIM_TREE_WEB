import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

//UNIT获取单位工程子单位列表
export const getUnitAcOK = createAction('UNIT获取单位工程子单位列表');
export const getUnitAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, [getUnitAcOK]);
//UNIT获取关联的单位工程子
export const getUnitAcTOK = createAction('UNIT获取关联的单位工程');
export const getUnitAcT = createFetchAction(`${SERVICE_API}/project-tree/?depth=2`, [getUnitAcTOK]);
//UNIT搜索单位工程
export const searchUnitAcOK = createAction('UNIT搜索单位工程');
export const searchUnitAc = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_WP_UNT`, [searchUnitAcOK]);
//UNIT搜索栏切换开关
export const searchToggleAc = createAction('UNIT搜索栏切换开关');
//UNIT获取单位审批人员信息列表
export const getExaminesAcOK = createAction('UNIT获取单位审批人员信息列表');
export const getExaminesAc = createFetchAction(`${USER_API}/users/?organization={{org}}`, [getExaminesAcOK]);
//UNIT获取组织机构列表
export const getOrgListAcOK = createAction('UNIT获取组织机构列表');
export const getOrgListAc = createFetchAction(`${SERVICE_API}/org-tree/`, [getOrgListAcOK]);
//新增单位工程
export const postUnitAc = createFetchAction(`${SERVICE_API}/workpackages/`, [],'POST');
//新增单位工程对应的location对象
export const postLocationAc = createFetchAction(`${SERVICE_API}/locations/`, [], "POST");
export const getWorkpackageByPk = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/`, [],'GET');
//编辑单位工程
export const putUnitAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [],'PUT');
export const putDir =  createFetchAction(`${SERVICE_API}/directories/code/{{code}}/`, [],'PUT');
//删除单位工程
export const deleteUnitAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?this=true`, [],'DELETE');
//UNIT设置当前选中的单位子单位工程
export const setSelectUnitAc = createAction('UNIT设置当前选中的单位子单位工程');
//UNIT新建或编辑区域的modal
export const toggleModalAc = createAction('UNIT新建或编辑区域的modal');
//UNIT设置上传的文件列表
export const postUploadFilesAc = createAction('UNIT设置上传的文件列表');
// 删除location对象
export const deleteLocationAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, [], 'DELETE');
//创建施工包流程
export const postInstance = createFetchAction(`${WORKFLOW_API}/instance/`, [],'POST');
//提交要下一步审批
export const postLogEvent = createFetchAction(`${WORKFLOW_API}/instance/{{pk}}/logevent/`, [],'POST');
//UNIT获取流程详情
export const getInstanceAcOK = createAction('UNIT获取流程详情');
export const getInstanceAc = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`, [getInstanceAcOK]);
//UNIT获取文件目录树
export const getDirTreeAcOK = createAction('UNIT获取文件目录树');
export const getDirTreeAc = createFetchAction(`${SERVICE_API}/dir-tree/code/${window.DeathCode.DATUM_ENGINEERING}/?depth=2`, [getDirTreeAcOK]);
//生成目录
export const postDirAc = createFetchAction(`${SERVICE_API}/directories/`, [],'POST');
//删除文档目录
export const delDirAc = createFetchAction(`${SERVICE_API}/directories/code/{{code}}/?this=true`, [],'DELETE');
//设置编码系统相关的信息
// export const setBuildNameAc = createAction('UNIT设置编码系统相关的信息');
//UNIT获取文档目录树
export const getDirListAcOK = createAction('UNIT获取文档目录树');
export const getDirListAc = createFetchAction(`${SERVICE_API}/metalist/Folder/`, [getDirListAcOK]);
//批量生成目录
export const postDirListAc = createFetchAction(`${SERVICE_API}/dirlist/`, [],'POST');
//判断当前是否可以创建子单位工程
export const setCanCreate = createAction("判断是否创建子单位工程")
const getOrgTreeReverseByCode =  createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/?reverse=true`, [],'GET');
const setCAnJianList = createAction('设置参见单位列表');
export const actions = {
	setCAnJianList,
	getOrgTreeReverseByCode,
	getWorkpackageByPk,
	getUnitAcOK,
	getUnitAc,
	getUnitAcTOK,
	getUnitAcT,
	searchUnitAcOK,
	searchUnitAc,
	searchToggleAc,
	getExaminesAcOK,
	getExaminesAc,
	getOrgListAcOK,
	getOrgListAc,
	postUnitAc,
	putUnitAc,
	deleteUnitAc,
	setSelectUnitAc,
	toggleModalAc,
	postUploadFilesAc,
	postInstance,
	postLogEvent,
	getInstanceAcOK,
	getInstanceAc,
	getDirTreeAcOK,
	getDirTreeAc,
	postDirAc,
	delDirAc,
	// setBuildNameAc,
	getDirListAcOK,
	getDirListAc,
	postDirListAc,
	postLocationAc,
	deleteLocationAc,
	setCanCreate,
	putDir
};

export default handleActions({
	[setCAnJianList]: (state, {payload}) => ({
		...state,
		canjianList: payload || [],
		// selectUnit:!state.selectUnit ? `${payload.children[0].code}--${payload.children[0].name}--${payload.children[0].obj_type}` : state.selectUnit,
	}),
	[getUnitAcOK]: (state, {payload}) => ({
		...state,
		unitList: payload.children || [],
		// selectUnit:!state.selectUnit ? `${payload.children[0].code}--${payload.children[0].name}--${payload.children[0].obj_type}` : state.selectUnit,
	}),
	[getUnitAcTOK]: (state, {payload}) => ({
		...state,
		unitListT: payload.children || [],
	}),
	[searchUnitAcOK]: (state, {payload}) => ( {
		...state,
		searchList: payload.result
	}),
	[searchToggleAc]: (state, {payload}) => ( {
		...state,
		searchVisible: payload
	}),
	[getExaminesAcOK]: (state, {payload}) => ( {
		...state,
		examines: payload
	}),
	[getOrgListAcOK]: (state, {payload}) => ( {
		...state,
		orgList: payload.children
	}),
	[setSelectUnitAc]: (state, {payload}) => ( {
		...state,
		selectUnit: payload
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
	[getDirTreeAcOK]: (state, {payload}) => ( {
		...state,
		dirTree: payload.children
	}),
	// [setBuildNameAc]: (state, {payload}) => ( {
	// 	...state,
	// 	buildName: payload
	// }),
	[getDirListAcOK]: (state, {payload}) => ( {
		...state,
		dirList: payload.metalist
	}),
	[setCanCreate]: (state, {payload}) => ({
		...state,
		canCreate: payload
	})
}, {});
