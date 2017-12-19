import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {CODE_API} from '_platform/api';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API} from '_platform/api'

export const ID = 'REPORT';

//获取树
export const getTreeOK = createAction('${ID}_获取项目结构树')
export const getTree =
	createFetchAction(`${SERVICE_API}/project-tree/?depth=3`,[getTreeOK]);

export const setIsAdd =  createAction ('事故报告-设置上传状态');
	//export const setCurrentAcc =  createAction ('事故登记-设置当前事故');
export const setAddModalVisible = createAction('事故报告-设置添加上传操作窗可视性');
	
	//添加管理制度
export const setInstitution = 
		createFetchAction(`${SERVICE_API}/main/api/station/inspect-plan/`,[],'POST');
		
	//上传文件
export const getStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [])
export const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST')
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')

export const actions = {
	getTreeOK,
	getTree,
	setIsAdd,
	setAddModalVisible,
    setInstitution,
    getStaticFile,
    uploadStaticFile,
    deleteStaticFile
};

export default handleActions({
	[getTreeOK]: (state, {payload: {children}}) => ({
		...state,
		tree: children
	}),


	[setIsAdd]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            isAdd: payload
        }
	},
	[setAddModalVisible]:(state, {payload}) => {
        return {
            ...state,
            AddModalVisible:payload.AddModalVisible
        }
    }
}, {});
