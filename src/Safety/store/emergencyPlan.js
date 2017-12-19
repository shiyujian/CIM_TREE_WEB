import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction'
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API} from '_platform/api'

export const ID = 'EMERGENCYPLAN';

export const setUploadFile = createAction('${ID}_获取上传的文件数据');

//上传文件
export const getStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [])
export const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST')
export const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE')

export const actions = {
    setUploadFile,
    
	getStaticFile,
    uploadStaticFile,
    deleteStaticFile
};

export default handleActions({
	[setUploadFile]: (state, {payload}) => ({
        ...state,
        attachment: payload
    })
}, {});
