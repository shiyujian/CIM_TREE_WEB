import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, WORKFLOW_API,base} from '_platform/api';

const ID = 'OVERALL_FORMMANAGE';
//上传的文件列表
export const postUploadFilesAc = createAction(`${ID}上传的文件列表`);

export const getdocumentOK = createAction(`${ID}_搜索目录文档`);

export const actions = {
    getdocumentOK,
    postUploadFilesAc,
}

export default handleActions({
    [postUploadFilesAc]: (state, {payload}) => ( {
		...state,
		fileList: payload
	}),
},{});