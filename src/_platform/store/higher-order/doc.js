import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from '../fetchAction';
import { capitalize } from '../util';
import { DOC_API, OSSUPLOAD_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    // 获取目录树
    const getDirTreeOK = createAction(`${ID}_GET_DOC_OK_${suffix}`);
    const getDirTree = createFetchAction(`${DOC_API}/dirtree`, [getDirTreeOK]);
    // 获取目录列表
    const getDirsList = createFetchAction(`${DOC_API}/dirs`, [], 'GET');
    // 获取目录详情
    const getDirDetail = createFetchAction(`${DOC_API}/dir/{{id}}`, [], 'GET');
    // 目录创建
    const postAddDir = createFetchAction(`${DOC_API}/dir`, [], 'POST');
    // 目录编辑
    const postEditDir = createFetchAction(`${DOC_API}/dir`, [], 'POST');
    // 批量增加
    const postBatchAddDir = createFetchAction(`${DOC_API}/dirs?projectid={{projectID}}`, [], 'POST');
    // 批量编辑
    const putBatchEditDir = createFetchAction(`${DOC_API}/dirs`, [], 'PUT');
    // 删除文件夹
    const deleteDir = createFetchAction(`${DOC_API}/dir/{{id}}`, [], 'DELETE');
    // 获取文档列表
    const getDocsList = createFetchAction(`${DOC_API}/docs`, [], 'GET');
    // 获取目录详情
    const getDocDetail = createFetchAction(`${DOC_API}/doc/{{id}}`, [], 'GET');
    // 文档创建
    const postAddDoc = createFetchAction(`${DOC_API}/doc`, [], 'POST');
    // 文档编辑
    const putEditDoc = createFetchAction(`${DOC_API}/doc`, [], 'PUT');
    // 上传附件
    const uploadFileHandler = myFetch(`${OSSUPLOAD_API}?filetype=doc`, [], 'POST');
    // 删除文档
    const deleteDoc = createFetchAction(`${DOC_API}/doc/{{id}}`, [], 'DELETE');

    const docReducer = handleActions(
        {
            [getDirTreeOK]: (state, { payload = {} }) => payload
        },
        []
    );

    docReducer[`get${SERVICE}DirTree`] = getDirTree;
    docReducer[`get${SERVICE}DirTreeOK`] = getDirTreeOK;
    docReducer[`get${SERVICE}DirsList`] = getDirsList;
    docReducer[`get${SERVICE}DirDetail`] = getDirDetail;

    docReducer[`post${SERVICE}AddDir`] = postAddDir;
    docReducer[`post${SERVICE}EditDir`] = postEditDir;
    docReducer[`post${SERVICE}BatchAddDir`] = postBatchAddDir;
    docReducer[`put${SERVICE}BatchEditDir`] = putBatchEditDir;
    docReducer[`delete${SERVICE}Dir`] = deleteDir;
    docReducer[`get${SERVICE}DocsList`] = getDocsList;
    docReducer[`get${SERVICE}DocDetail`] = getDocDetail;
    docReducer[`post${SERVICE}AddDoc`] = postAddDoc;
    docReducer[`put${SERVICE}EditDoc`] = putEditDoc;
    docReducer[`upload${SERVICE}FileHandler`] = uploadFileHandler;
    docReducer[`delete${SERVICE}Doc`] = deleteDoc;

    return docReducer;
};
