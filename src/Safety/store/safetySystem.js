import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {base, SERVICE_API, FOREST_API,FOREST_SYSTEM, FILE_API, WORKFLOW_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './fetchAction'


export const ID = 'safetySystem';
export const AddVisible = createAction(`${ID}新增显示和隐藏`);
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]); //    √
export const setkeycode =createAction(`${ID}_setkeycode`);

export const getTreeList = createFetchAction(`${FOREST_API}/tree/treetypes`, [getTreeListOK]);
export const getTreeListOK = createAction('获取森林树种列表');
export const gettreetype = createFetchAction(`${FOREST_API}/tree/treetypesbyno`, []);
export const getForestTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, []); //    √
export const getNurserysTree = createFetchAction(`${FOREST_API}/tree/treenurserys`, []);
export const getForestUsersOK = createAction('获取森林数据用户列表');
export const getForestUsers = createFetchAction(`${FOREST_SYSTEM}/users`, [getForestUsersOK]);
export const getWorkflowById = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[],'GET');

export const getTaskSafetyOK = createAction(`${ID}搜索流程`);
export const getTaskSafety = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[getTaskSafetyOK],'GET');
//上传文件
export const postSafeFile = myFetch(`${FILE_API}/api/user/files/`,[],'POST');
const changeDocs = createAction(`${ID}_CHANGE_DOCS`);

export const actions = {
	AddVisible,
	getTree,
	getTreeOK,
	setkeycode,
	changeDocs,
	gettreetype,
	getTreeList,
	getNurserysTree,
	getForestTreeNodeList,
	getForestUsers,
	postSafeFile,
	getWorkflowById,
	getTaskSafetyOK,
	getTaskSafety
};
export default handleActions({
	[changeDocs]: (state, {payload}) => ({
        ...state,
        docs: payload
    }),
	[AddVisible]: (state, {payload}) => ( {
		...state,
		addVisible: payload
	}),
	[getTreeOK]: (state, {payload}) => ( {
		...state,
		treeLists: payload
	}),
	[setkeycode]: (state, {payload}) => ({
        ...state,
        keycode: payload
    }),
    [getTreeListOK]: (state, {payload}) => ({
			...state,
			treetypes:payload
	}),
    [getForestUsersOK]: (state, {payload: {content}}) => {
		let users = {};
        if(content){
            content.forEach(user => users[user.ID] = user);
		}
		return {
			...state,
			users
		};
	},
	[getTaskSafetyOK]: (state, {payload}) => ({
		...state,
		safetyTaskList:payload
}),
}, {});

