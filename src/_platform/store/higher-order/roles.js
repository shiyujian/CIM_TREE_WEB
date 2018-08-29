import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { USER_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getRolesOK = createAction(`${ID}_GET_ROLES_OK_${suffix}`);
    const getRoles = createFetchAction(`${USER_API}/roles/`, [getRolesOK]);
    const getRole = createFetchAction(`${USER_API}/role/{id}/`);
    const postRole = createFetchAction(`${USER_API}/roles/`, 'POST');
    const putRole = createFetchAction(`${USER_API}/roles/{{id}}/`, 'PUT');
    const deleteRole = createFetchAction(`${USER_API}/roles/{{id}}/`, 'DELETE');

    const rolesReducer = handleActions(
        {
            [getRolesOK]: (state, { payload = [] }) => {
                return payload.map((role, index) => ({
                    ...role,
                    index: index + 1
                }));
            }
        },
        []
    );

    rolesReducer[`get${SERVICE}Roles`] = getRoles;
    rolesReducer[`get${SERVICE}Role`] = getRole;
    rolesReducer[`set${SERVICE}RolesOK`] = getRolesOK;
    rolesReducer[`post${SERVICE}Role`] = postRole;
    rolesReducer[`put${SERVICE}Role`] = putRole;
    rolesReducer[`delete${SERVICE}Role`] = deleteRole;

    return rolesReducer;
};
