import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { USER_API, SYSTEM_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getRolesOK = createAction(`${ID}_GET_ROLES_OK_${suffix}`);
    const getRoles = createFetchAction(`${SYSTEM_API}/roles`, [getRolesOK]);
    const postRole = createFetchAction(`${USER_API}/roles/`, 'POST');
    const putRole = createFetchAction(`${USER_API}/roles/{{id}}/`, 'PUT');
    const deleteRole = createFetchAction(`${USER_API}/roles/{{id}}/`, 'DELETE');
    const getMembers = createFetchAction(`${USER_API}/roles/{{id}}/members/`, [], 'GET');

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
    rolesReducer[`set${SERVICE}RolesOK`] = getRolesOK;
    rolesReducer[`get${SERVICE}Roles`] = getRoles;
    rolesReducer[`post${SERVICE}Role`] = postRole;
    rolesReducer[`put${SERVICE}Role`] = putRole;
    rolesReducer[`delete${SERVICE}Role`] = deleteRole;
    rolesReducer[`delete${SERVICE}Members`] = getMembers;

    return rolesReducer;
};
