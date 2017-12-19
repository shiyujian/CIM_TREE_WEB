import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {capitalize} from '../util';
import {CODE_API} from '../../api';

export default (ID, service = '') => {
	const suffix = service.toUpperCase();
	const SERVICE = capitalize(service);
	const getDictValuesOK = createAction(`${ID}_GET_DICT_VALUES_OK_${suffix}`);
	const getDictValues = createFetchAction(`${CODE_API}/api/v1/dict-values/public/`, [getDictValuesOK]);

	const dictReducer = handleActions({
		[getDictValuesOK]: (state, {payload = {}}) => (payload),
	}, []);

	dictReducer[`get${SERVICE}DictValuesOK`] = getDictValuesOK;
	dictReducer[`set${SERVICE}DictValues`] = getDictValues;

	return dictReducer;
};
