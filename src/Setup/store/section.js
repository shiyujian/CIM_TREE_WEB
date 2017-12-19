import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

export const getWbsProjectAcOK = createAction('SECTION获取WBS结构');
export const getWbsProjectAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=7`, [getWbsProjectAcOK]);
export const searchWbsProjectAcOK = createAction('SECTION搜索WBS中的相关数据');
// 搜索分部
export const searchWbsProjectAc = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_WP_PTR`, [searchWbsProjectAcOK]);
// 搜索子分部
export const searchUnit_sOK = createAction('SECTION中搜索子单位工程的相关数据');
export const searchUnit_s = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_WP_PTR_S`,[searchUnit_sOK]);
// 搜索分项
export const searchItemOK = createAction('SECTION中搜索分项的相关数据');
export const searchItem = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_WP_ITM`,[searchItemOK]);
//SECTION搜索栏切换开关
export const searchToggleAc = createAction('SECTION搜索栏切换开关');
//SECTION获取专业列表
export const getProfessAcOK = createAction('SECTION获取专业列表');
export const getProfessAc = createFetchAction(`${SERVICE_API}/professlist/`, [getProfessAcOK]);
//新增分部分项
export const postWorkPackageAc = createFetchAction(`${SERVICE_API}/workpackages/`, [],'POST');
//编辑分部分项
export const putWorkPackageAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [],'PUT');
//删除分部分项
export const deleteWbsProjectAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?this=true`, [],'DELETE');
//设置当前选中的WBS项目工程
export const setSelectWbsProjectAc = createAction('SECTION设置当前选中的WBS项目工程');
//新建或编辑区域的modal
export const toggleModalAc = createAction('SECTION新建或编辑区域的modal');
//导入创建的modal
export const importModalAc = createAction('SECTION导入创建的modal');
//SECTION设置当前编辑的分部分项
export const setCurrentEditDataAc = createAction('SECTION设置当前编辑的分部分项');
//SECTION获取专业列表
export const getTemplatesAcOK = createAction('SECTION获取模板下载列表');
export const getTemplatesAc = createFetchAction(`${SERVICE_API}/excel/templates/`, [getTemplatesAcOK]);
// 创建分部Loc
export const postLocationAc = createFetchAction(`${SERVICE_API}/locations/`, [], "POST");
// 删除loc
export const delLocationAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, [], "DELETE");
// 获取单个location分部
export const getLocationOneAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?children=true`, [], "GET");
export const getWorkpackageOneAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?children=true`, [], "GET");

//设置当前选中的node节点的table数据
export const setTableDataAc = createAction('SECTION设置当前选中的node节点的table数据');
//设置当前创建的是那种类型的编码
export const setCreateTypeAc = createAction('SECTION设置当前创建的是那种类型的编码');
//SECTION获取分项的尾码列表
export const getItmTypesAcOK = createAction('SECTION获取分项的尾码列表');
export const getItmTypesAc = createFetchAction(`${SERVICE_API}/metalist/wpitemtypes/`, [getItmTypesAcOK]);
//SECTION设置编码系统相关的信息
export const setBuildNameAc = createAction('SECTION设置编码系统相关的信息');
// 单位工程存储当前需要添加的节点类型
export const setNodeType = createAction('判断添加的节点类型');
export const actions = {
	getWbsProjectAcOK,
	getWbsProjectAc,
	searchWbsProjectAcOK,
	searchWbsProjectAc,
	searchToggleAc,
	getProfessAcOK,
	getProfessAc,
	postWorkPackageAc,
	putWorkPackageAc,
	deleteWbsProjectAc,
	setSelectWbsProjectAc,
	toggleModalAc,
	importModalAc,
	setTableDataAc,
	setCurrentEditDataAc,
	getTemplatesAcOK,
	getTemplatesAc,
	setCreateTypeAc,
	getItmTypesAcOK,
	getItmTypesAc,
	setBuildNameAc,
	postLocationAc,
	delLocationAc,
	setNodeType,
	searchUnit_s,
	searchItem,
	searchItemOK,
	searchUnit_sOK,
	getLocationOneAc,
	getWorkpackageOneAc
};

export default handleActions({
	[getWbsProjectAcOK]: (state, {payload}) => ({
		...state,
		// wbsProjectList: _getUnitProject(payload.children[0].children || []),
		wbsProjectList: payload.children || [],
		selectWbsProject:!state.selectWbsProject ? `${_getUnitProject(payload.children || [])[0].code}--${_getUnitProject(payload.children || [])[0].name}` : state.selectWbsProject,
		tableList:
			state.selectWbsProject
				?
			[_checkLoop(_getUnitProject(payload.children || []),state.selectWbsProject.split('--')[0])]
				:
			[_getUnitProject(payload.children || [])[0]]
	}),
	[searchWbsProjectAcOK]: (state, {payload}) => ( {
		...state,
		searchWbsList: payload.result
	}),
	[searchItemOK]: (state, {payload}) => ( {
		...state,
		searchItemList: payload.result
	}),
	[searchUnit_sOK]: (state, {payload}) => ( {
		...state,
		searchUnit_sList: payload.result
	}),
	[searchToggleAc]: (state, {payload}) => ( {
		...state,
		searchVisible: payload
	}),
	[getProfessAcOK]: (state, {payload}) => ( {
		...state,
		professList: payload.professlist
	}),
	[setSelectWbsProjectAc]: (state, {payload}) => ( {
		...state,
		selectWbsProject: payload
	}),
	[toggleModalAc]: (state, {payload}) => ( {
		...state,
		toggleData: payload
	}),
	[importModalAc]: (state, {payload}) => ( {
		...state,
		importVisible: payload
	}),
	[setTableDataAc]: (state, {payload}) => ( {
		...state,
		tableList: payload
	}),
	[setCurrentEditDataAc]: (state, {payload}) => ( {
		...state,
		currentEditData: payload
	}),
	[getTemplatesAcOK]: (state, {payload}) => ( {
		...state,
		templatesList: payload
	}),
	[setCreateTypeAc]: (state, {payload}) => ( {
		...state,
		createType: payload
	}),
	[getItmTypesAcOK]: (state, {payload}) => ( {
		...state,
		itmTypes: payload.metalist || []
	}),
	[setBuildNameAc]: (state, {payload}) => ( {
		...state,
		buildName: payload
	}),
	[setNodeType]: (state, {payload}) => ( {
		...state,
		nodeType: payload
	}),

	
}, {});

export function _getUnitProject(projectList) {
	let newList=[];
	projectList.map(project=>{
		newList=newList.concat(project.children)
	});
	return newList;
}

//查询数据
let rst=[];
export function _checkLoop (list, checkCode){
	list.find((item = {}) => {
		const {code, children = []} = item;
		if (code === checkCode) {
			rst = item;
		} else {
			const tmp = _checkLoop(children, checkCode);
			if (tmp) {
				rst = tmp;
			}
		}
	});
	return rst;
};