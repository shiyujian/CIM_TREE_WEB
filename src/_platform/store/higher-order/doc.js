import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API } from '../../api';
import { capitalize } from '../util';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    service = capitalize(service);
    const addDocument = createAction(`${ID}_ADD_DOCUMENT_${suffix}`);
    const getDocumentOK = createAction(`${ID}_GET_DOCUMENT_OK_${suffix}`);
    const getDocument = createFetchAction(
        `${SERVICE_API}/documents/code/{{code}}/?all=true`,
        [getDocumentOK]
    );
    const postDocument = createFetchAction(`${SERVICE_API}/documents/`, 'POST');
    const deleteDocument = createFetchAction(
        `${SERVICE_API}/documents/code/{{code}}/?this=true`,
        'DELETE'
    );
    const PatchDocument = createFetchAction(
        `${SERVICE_API}/documents/code/{{code}}/?this=true`,
        'PATCH'
    );

    const documentReducer = handleActions(
        {
            [addDocument]: (state, { payload }) => ({
                ...payload
            }),
            [getDocumentOK]: (state, { payload }) => ({
                ...payload
            })
        },
        {}
    );

    documentReducer[`add${service}Document`] = addDocument;
    documentReducer[`get${service}Document`] = getDocument;
    documentReducer[`get${service}DocumentOK`] = getDocumentOK;
    documentReducer[`post${service}Document`] = postDocument;
    documentReducer[`delete${service}Document`] = deleteDocument;
    documentReducer[`patch${service}Document`] = PatchDocument;

    return documentReducer;
};
