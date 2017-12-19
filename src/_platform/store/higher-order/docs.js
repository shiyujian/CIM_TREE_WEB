import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {SERVICE_API} from '../../api';
import {capitalize} from '../util';
import documentFactory from './doc';

export default (ID, service = '') => {
	const suffix = service.toUpperCase();
	service = capitalize(service);
	const documentReducer = documentFactory(ID);
	const getDocumentsOK = createAction(`${ID}_GET_DOCUMENTS_OK_${suffix}`);
	const getDocuments = createFetchAction(
		`${SERVICE_API}/doc_searcher/dir_code/{{code}}/`, [getDocumentsOK]);

	const documentsReducer = handleActions({
		[getDocumentsOK]: (state, {payload: {result = []} = {}}) =>
			(result.map((payload) =>
				documentReducer(undefined, {
					type: documentReducer.addDocument,
					payload,
				}))),
	}, []);

	documentsReducer[`get${service}DocumentsOK`] = getDocumentsOK;
	documentsReducer[`get${service}Documents`] = getDocuments;
	return documentsReducer;
};
