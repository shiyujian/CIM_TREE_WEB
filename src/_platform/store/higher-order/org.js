import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { SYSTEM_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getOrgTreeOK = createAction(`${ID}_GET_ORG_OK_${suffix}`);
    const getOrgTree = createFetchAction(`${SYSTEM_API}/orgtree`, [
        getOrgTreeOK
    ]);
    // 分类获取数据
    const getOrgTreeByOrgType = createFetchAction(
        `${SYSTEM_API}/orgs?orgtype={{orgtype}}`,
        'GET'
    );
    // 反查
    const getParentOrgTreeByID = createFetchAction(
        `${SYSTEM_API}/revertorgtree?id={{id}}`,
        'GET'
    );
    // 获取某个节点的组织机构树
    const getChildOrgTreeByID = createFetchAction(
        `${SYSTEM_API}/suborgtree?id={{id}}`,
        'GET'
    );
    // 新增组织机构
    const postAddOrg = createFetchAction(`${SYSTEM_API}/org`, 'POST');
    // 修改组织机构
    const putChangeOrg = createFetchAction(`${SYSTEM_API}/org`, 'PUT');
    // 删除组织机构
    const deleteOrg = createFetchAction(
        `${SYSTEM_API}/org/{{ID}}`,
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
    orgReducer[`post${SERVICE}AddOrg`] = postAddOrg;
    orgReducer[`put${SERVICE}ChangeOrg`] = putChangeOrg;
    orgReducer[`delete${SERVICE}Org`] = deleteOrg;
    orgReducer[`get${SERVICE}OrgTreeByOrgType`] = getOrgTreeByOrgType;
    orgReducer[`get${SERVICE}ParentOrgTreeByID`] = getParentOrgTreeByID;
    orgReducer[`get${SERVICE}ChildOrgTreeByID`] = getChildOrgTreeByID;

    return orgReducer;
};
