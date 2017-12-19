/**
 * Created by pans0911 on 2017/5/26.
 */
import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import {USER_API, SERVICE_API} from '_platform/api';
import casecadeProjectFactory from './cascadeProject';
import fieldFactory from '_platform/store/service/field';

const planWorkPackageReducer = casecadeProjectFactory();
const filterReducer = fieldFactory('PLAN', 'filter');
const radioToggle = createAction('不同计划填报的切换');
const editIndex = createAction('编辑了哪些单元');
const updateWork = createFetchAction(`${SERVICE_API}/wpputlist/`,[],'PUT');

const unitListOK = createAction('获取单位list');
const unitList = createFetchAction(`${SERVICE_API}/unitlist/`,[unitListOK]);

const loadToggle = createAction('loading状态');
export const actions = {
	...planWorkPackageReducer,
	...filterReducer,
	radioToggle,
	loadToggle,
	editIndex,
	updateWork,
	unitList,
	unitListOK
};
export default handleActions({
	[radioToggle]: (state, action) => {
		return {
			...state,
			radioValue: action.payload
		}
	},
	[loadToggle]: (state, action) => {
		return {
			...state,
			loadingStatus: action.payload
		}
	},
	[editIndex]: (state, action) => {
		let idxs=state.editIdx || [];
		if(state.editIdx === undefined){
			idxs.push(action.payload)
		}else{
			// if($.inArray(action.payload,idxs)<0){
			// 	idxs.push(action.payload)
			// }
		}
		return {
			...state,
			editIdx: idxs
		}
	},
	[unitListOK]: (state, {payload}) => {
		return {
			...state,
			units: payload.units
		}
	},
	[combineActions(...actionsMap(filterReducer))]: (state, action) => ({
		...state,
		filter: filterReducer(state.filter, action)
	}),
	[combineActions(...actionsMap(planWorkPackageReducer))]: (state, action) => ({
		...state,
		planWorkPackage: planWorkPackageReducer(state.planWorkPackage, action)
	})
}, {});
