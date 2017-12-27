import {handleActions, combineActions,createAction} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API,USER_API,WORKFLOW_API,FILE_API} from '_platform/api';

const uploadStaticFile = createFetchAction(`${FILE_API}/api/user/files/`, [], 'POST');
export const ModalVisibleProject = createAction('项目信息模态框显示隐藏');
export const postProjectAc = createFetchAction(`${SERVICE_API}/projects/`, [],'POST');
export const getProjectAc = createFetchAction(`${SERVICE_API}/project-tree/?depth=1`, []);
export const getProjectAcD3 = createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, []);
export const getOrgByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`, []);
export const postProjectListAc = createFetchAction(`${SERVICE_API}/projectlist/`, [],'POST');
export const putProjectListAc = createFetchAction(`${SERVICE_API}/projectlist/`, [],'PUT');
export const postDocListAc = createFetchAction(`${SERVICE_API}/documentlist/`, [],'POST');
export const putDocListAc = createFetchAction(`${SERVICE_API}/documentlist/`, [],'put');
export const getPersonByCode = createFetchAction(`${SERVICE_API}/persons/code/{{code}}/`, [],'GET');
export const getProjectByCode = createFetchAction(`${SERVICE_API}/projects/code/{{code}}/?all=true`, [],'GET');
export const getDocByCode = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`, [],'GET');
export const getDocByCodeList = createFetchAction(`${SERVICE_API}/documentgetlist/`, [],'POST');
export const getDocByCodeSearcher = createFetchAction(`${SERVICE_API}/searcher/?keyword={{code}}&&obj_type=C_DOC`, [],'get');
export const actions = {
	ModalVisibleProject,
	postProjectAc,
	getProjectAc,
	postProjectListAc,
	postDocListAc,
	getPersonByCode,
	getProjectByCode,
	getDocByCode,
	getOrgByCode,
	getProjectAcD3,
	getDocByCodeList,
	getDocByCodeSearcher,
	putProjectListAc,
	putDocListAc
};
export default handleActions({
	[ModalVisibleProject]: (state, {payload}) => ({
		...state,
		visible:payload,
	}),
}, {});







