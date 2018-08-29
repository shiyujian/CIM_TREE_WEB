import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { USER_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getMembersOK = createAction(`${ID}_GET_MEMBERS_OK_${suffix}`);
    const getMembers = createFetchAction(`${USER_API}/roles/{{id}}/members/`, [
        getMembersOK
    ]);
    const putMembers = createFetchAction(
        `${USER_API}/roles/{{id}}/members/`,
        'PUT'
    );

    const membersReducer = handleActions(
        {
            [getMembersOK]: (state, { payload: { members = [] } = {} }) => {
                return members.map((member, index) => {
                    return {
                        ...member,
                        ...member.account,
                        index: index + 1
                    };
                });
            }
        },
        []
    );

    membersReducer[`get${SERVICE}Members`] = getMembers;
    membersReducer[`get${SERVICE}MembersOK`] = getMembersOK;
    membersReducer[`put${SERVICE}Members`] = putMembers;

    return membersReducer;
};
