import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { SYSTEM_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getRolesOK = createAction(`${ID}_GET_ROLES_OK_${suffix}`);
    const getRoles = createFetchAction(`${SYSTEM_API}/roles`, [getRolesOK]);
    const postRole = createFetchAction(`${SYSTEM_API}/role`, 'POST');
    const putRole = createFetchAction(`${SYSTEM_API}/role`, 'PUT');
    const deleteRole = createFetchAction(`${SYSTEM_API}/role/{{id}}`, 'DELETE');
    const changeRolePermission = createFetchAction(`${SYSTEM_API}/rolefunction`, 'POST');
    const getRolePermission = createFetchAction(`${SYSTEM_API}/functions?roleid={{roleId}}`, 'GET');

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
    rolesReducer[`change${SERVICE}RolePermission`] = changeRolePermission;
    rolesReducer[`get${SERVICE}RolePermission`] = getRolePermission;

    return rolesReducer;
};
