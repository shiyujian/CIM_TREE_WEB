import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction'
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API} from '_platform/api'

export const ID = 'TECHNICALDISCLOSURE';

export const setIsAddPlan =  createAction ('安全技术交底-设置新增状态');
//export const setCurrentAcc =  createAction ('事故登记-设置当前事故');
export const setAddModalVisiblePlan = createAction('安全技术交底-设置添加内容操作窗可视性');

//上传文件
export const getStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [])
export const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST')
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')


//添加管理制度
export const setEmergency = 
	createFetchAction(`${SERVICE_API}/main/api/station/inspect-plan/`,[],'POST');


export const actions = {
	setIsAddPlan,
	setAddModalVisiblePlan,
	setEmergency,
	getStaticFile,
    uploadStaticFile,
    deleteStaticFile
};

export default handleActions({
	[setIsAddPlan]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            isAddPlan: payload
        }
	},
	[setAddModalVisiblePlan]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            AddModalVisiblePlan:payload.AddModalVisiblePlan
        }
    }
}, {});
