import {createAction, handleActions} from 'redux-actions';
import {FILE_API,UPLOADFILE_API} from '_platform/api';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction'
export const ID= 'docdispatch';

const getStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, []);
const uploadStaticFile = createFetchActionWithHeaders(`${FILE_API}/api/user/files/`, [], 'POST');
const deleteStaticFile = createFetchAction(`${FILE_API}/api/user/files/{{id}}`, [], 'DELETE');

export const actions = {
    getStaticFile,
    uploadStaticFile,
    deleteStaticFile
}

export default handleActions(
    {
    }, {}
);