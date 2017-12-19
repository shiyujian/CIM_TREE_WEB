import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import player, * as playerActions from './player';
import {SERVICE_API} from '_platform/api';
import {actionsMap} from '_platform/store/util';
const ID = 'SCHEDULE_SHOW_DGN';

export * from './player';

export const getProjectsOK = createAction(`${ID}_GET_PROJECTS_OK`);
export const getProjects = createFetchAction(
	`${SERVICE_API}/project-tree/?depth=4`, [getProjectsOK]);
	// `${SERVICE_API}/projects/code/Q01V/?all=true`, [getProjectsOK]);

export const reloadProjects = createAction(`${ID}_RELOAD_PROJECTS`);
export const getWorkPackages = createFetchAction(
	`${SERVICE_API}/workpackages/code/{{code}}/?all=true`);

export const setCurrentNode = createAction(`${ID}_SET_CURRENT_NODE`);
//批量模型下载地址
const getImodelInfoAc = createFetchAction(`${SERVICE_API}/documents/code/{{pk}}/?all=true`,[]);

export const actions = {
	getProjectsOK,
	getProjects,
	reloadProjects,
	getWorkPackages,
	setCurrentNode,
	getImodelInfoAc,
	...playerActions
};


export default handleActions({
	[getProjectsOK]: (state, {payload}) => {
		let projects = [];
		if(payload && payload.children && payload.children.length>0 && payload.children[0].children){
			projects = payload.children[0].children;
		}
		return {
			...state,
			projects:projects
		}
	},
	[reloadProjects]: (state) => {
		const projects = state.projects;
		return {
			...state,
			projects: [...projects]
		};
	},
	[setCurrentNode]: (state, {payload}) => ({
		...state,
		currentNode: payload
	}),
	[combineActions(...actionsMap(playerActions))]: (state, action) => ({
		...state,
		player: player(state.player, action)
	})
}, {});
