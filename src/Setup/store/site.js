import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API} from '_platform/api';

export const getLocationAcOk = createAction('SITE获取WBS结构');
export const getLocationAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=7`, [getLocationAcOk]);
export const searchWbsProjectAcOK = createAction('SITE搜索WBS中的相关数据');
export const searchWbsProjectAc = createFetchAction(`${SERVICE_API}/searcher/?keyword={{keyword}}&obj_type=C_LOC_PJ`, [searchWbsProjectAcOK]);
//SECTION搜索栏切换开关
export const searchToggleAc = createAction('SITE搜索栏切换开关');
//SECTION获取专业列表
export const getProfessAcOK = createAction('SITE获取专业列表');
export const getProfessAc = createFetchAction(`${SERVICE_API}/professlist/`, [getProfessAcOK]);
//新增分部分项
export const postLocationAc = createFetchAction(`${SERVICE_API}/locations/`, [],'POST');
export const getLocationOne = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/`, [],'GET');
//编辑分部分项
export const putWorkpackagesAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [],'PUT');
//编辑工程部位
export const putLocationsAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/`, [],'PUT');
//删除分部分项
export const getSectionAc = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?locations=true`, [],'GET');
export const deleteLocationAc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, [],'DELETE');
//设置当前选中的WBS项目工程
export const setSelectWbsProjectAc = createAction('SITE设置当前选中的WBS项目工程');
//新建或编辑区域的modal
export const toggleModalAc = createAction('SITE新建或编辑区域的modal');
//导入创建的modal
export const importModalAc = createAction('SITE导入创建的modal');
//SECTION设置当前编辑的分部分项
export const setCurrentEditDataAc = createAction('SITE设置当前编辑的分部分项');
//SECTION获取专业列表
export const getTemplatesAcOK = createAction('SITE获取模板下载列表');
export const getTemplatesAc = createFetchAction(`${SERVICE_API}/excel/templates/`, [getTemplatesAcOK]);

//设置当前选中的node节点的table数据
export const setTableDataAc = createAction('SITE设置当前选中的node节点的table数据');
//SITE设置编码系统相关的信息
export const setBuildNameAc = createAction('SITE设置编码系统相关的信息');
//判断当前是否可以创建工程部位
export const setCreate = createAction('判断当前是否可以创建单位工程');
export const actions = {
	getLocationAcOk,
	getLocationAc,
	searchWbsProjectAcOK,
	searchWbsProjectAc,
	searchToggleAc,
	getProfessAcOK,
	getProfessAc,
	postLocationAc,
	putWorkpackagesAc,
	deleteLocationAc,
	setSelectWbsProjectAc,
	toggleModalAc,
	importModalAc,
	setTableDataAc,
	setCurrentEditDataAc,
	getTemplatesAcOK,
	getTemplatesAc,
	setBuildNameAc,
	setCreate,
	getSectionAc,
	getLocationOne,
	putLocationsAc
};

export default handleActions({
	[getLocationAcOk]: (state, {payload}) => ({
		...state,
		wbsProjectList: payload.children,
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
		searchWbsList: payload.result.filter(item => {
			return item.code.indexOf("_SIT") > -1 ? true : false;
		})
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
	[setBuildNameAc]: (state, {payload}) => ( {
		...state,
		buildName: payload
	}),
	[setCreate]: (state, {payload}) => ({
		...state,
		canCreate: payload
	})
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