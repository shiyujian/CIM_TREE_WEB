import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
import {SERVICE_API,NODE_FILE_EXCHANGE_API} from '_platform/api';

//获取项目树
export const getProjectTreeCost = createFetchAction(`${SERVICE_API}/project-tree/?depth=1`, []);
//获取具体项目树下子项目或单元
export const getSubTreeOK = createAction('获取具体某个项目信息');
export const getSubTree = createFetchAction(`${SERVICE_API}/project-tree/{{pk}}/`, [getSubTreeOK]);
//获取施工包概算数据
const getEstimateData = createFetchAction(`${SERVICE_API}/workpackages/{{pk}}/?children=true&parent=true{{t}}`,[]);
//获取表格模板
const getExcelTemplate = createFetchAction(`${SERVICE_API}/excel/templates/`,[]);
//批量修改施工包
const updateWpData = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');
//导出数据
const jsonToExcel = createFetchAction(`${NODE_FILE_EXCHANGE_API}/api/json_to_xlsx`,[],'POST');

//test
//const test = createAction('sdsa');

export const actions = {
	getProjectTreeCost,
	getSubTree,
	getSubTreeOK,
	getEstimateData,
	getExcelTemplate,
	updateWpData,
	jsonToExcel,
	//test,
};
export default handleActions({
	[getSubTreeOK]: (state, {payload}) =>  {
		let subsection = [];
		let loop = data => {
			data.map(item => {
				if(item.obj_type_hum === '单位工程'){
					subsection.push(item);
				}else{
					loop(item.children)
				}
			})
		}
		loop([payload]);
		return {
			...state,
			subsection: subsection
		}
	},
/*	[test]: (state, {payload}) =>  {
		alert();
		return {
			...state,
			test: 'test'
		}
	}*/
}, {});
