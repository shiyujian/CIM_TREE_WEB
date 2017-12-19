import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {capitalize} from '../util';
import {SERVICE_API} from '../../api';

export default (ID, service = '') => {
	const suffix = service.toUpperCase();
	const SERVICE = capitalize(service);
	const getLocTreeOK = createAction(`${ID}_GET_LOC_TREE_OK_${suffix}`);
	const getLocTree = createFetchAction(
        `${SERVICE_API}/loc-tree/`, [getLocTreeOK]);
    const getLoc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?all=true`)
	const postLoc = createFetchAction(`${SERVICE_API}/locations/`, 'POST');
	const putLoc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, 'PUT');
	const deleteLoc = createFetchAction(`${SERVICE_API}/locations/code/{{code}}/?this=true`, 'DELETE');

	const locsReducer = handleActions({
		[getLocTreeOK]: (state, {payload = {}}) => (payload),
	}, []);

	locsReducer[`get${SERVICE}LocTree`] = getLocTree;
	locsReducer[`set${SERVICE}LocTreeOK`] = getLocTreeOK;
	locsReducer[`get${SERVICE}Loc`] = getLoc;
	locsReducer[`post${SERVICE}Loc`] = postLoc;
	locsReducer[`put${SERVICE}Loc`] = putLoc;
	locsReducer[`delete${SERVICE}Loc`] = deleteLoc;

	return locsReducer;
};

