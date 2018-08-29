import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { SERVICE_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getOrgTreeOK = createAction(`${ID}_GET_ORG_OK_${suffix}`);
    const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/`, [
        getOrgTreeOK
    ]);
    const postOrg = createFetchAction(`${SERVICE_API}/orgs/`, 'POST');
    const putOrg = createFetchAction(
        `${SERVICE_API}/orgs/code/{{code}}/?this=true`,
        'PUT'
    );
    const deleteOrg = createFetchAction(
        `${SERVICE_API}/orgs/code/{{code}}/?this=true`,
        'DELETE'
    );

    const orgReducer = handleActions(
        {
            [getOrgTreeOK]: (state, { payload = {} }) => payload
        },
        []
    );

    orgReducer[`get${SERVICE}OrgTree`] = getOrgTree;
    orgReducer[`set${SERVICE}OrgTreeOK`] = getOrgTreeOK;
    orgReducer[`post${SERVICE}Org`] = postOrg;
    orgReducer[`put${SERVICE}Org`] = putOrg;
    orgReducer[`delete${SERVICE}Org`] = deleteOrg;

    return orgReducer;
};
