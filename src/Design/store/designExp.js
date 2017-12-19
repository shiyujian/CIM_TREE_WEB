import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';


const ID = 'DESIGN_EXPLAIN';
const setSelectedUnitProject = createAction(`${ID}_设置当前选定的单位工程`);


//通过当前单位工程 获取 相关流程中 设计交底列表
const getCurrentDesignExpListOK = createAction(`${ID}_获取当前设计交底列表`)
//TODO:
const getCurrentDesignExpList = createFetchAction();
const setFilteredDesignExpList = createAction(`${ID}_设置过滤后的交底列表`);


export const actions = {
	setSelectedUnitProject,
	getCurrentDesignExpListOK,
	getCurrentDesignExpList,
	setFilteredDesignExpList,
};


export default handleActions({
	[setSelectedUnitProject]: (state,{payload}) => ({
		...state,
		selectedUnitProject: payload,
	}),
	[getCurrentDesignExpListOK]: (state,{payload})=>({
		...state,
		designExpList: payload,
	}),

	[setFilteredDesignExpList]: (state,{payload})=>({
		...state,
		filteredDesignExpList: payload,
	}),



}, {});