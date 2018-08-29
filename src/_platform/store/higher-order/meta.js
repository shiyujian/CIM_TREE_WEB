import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API } from '../../api';
import { capitalize } from '../util';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getMetaOK = createAction(`${ID}_GET_${suffix}_META_OK`);
    const getMeta = createFetchAction(`${SERVICE_API}/metalist/${service}/`, [
        getMetaOK
    ]);

    const metaReducer = handleActions(
        {
            [getMetaOK]: (state, { payload: { metalist = [] } }) => [
                ...metalist
            ]
        },
        []
    );
    metaReducer[`get${SERVICE}MetaOK`] = getMetaOK;
    metaReducer[`get${SERVICE}Meta`] = getMeta;
    return metaReducer;
};
