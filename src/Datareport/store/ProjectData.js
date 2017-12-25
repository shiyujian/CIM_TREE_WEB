import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,FILE_API} from '_platform/api';

const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
export const ModalVisibleProject = createAction('项目信息模态框显示隐藏');
export const postProjectAc = createFetchAction(`${SERVICE_API}/projects/`, [],'POST');
export const getProjectAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=1`, []);
export const postProjectListAc = createFetchAction(`${SERVICE_API}/projectlist/`, [],'POST');
export const postDocListAc = createFetchAction(`${SERVICE_API}/documentlist/`, [],'POST');
export const getPersonByCode = createFetchAction(`${SERVICE_API}/persons/code/{{code}}/`, [],'GET');
export const getProjectByCode = createFetchAction(`${SERVICE_API}/projects/code/{{code}}/?all=true`, [],'GET');
export const getDocByCode = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [],'GET');
export const actions = {
	ModalVisibleProject,
	postProjectAc,
	getProjectAc,
	postProjectListAc,
	postDocListAc,
	getPersonByCode,
	getProjectByCode,
	getDocByCode
};
export default handleActions({
	[ModalVisibleProject]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});







