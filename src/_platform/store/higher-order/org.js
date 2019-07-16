import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { capitalize } from '../util';
import { SERVICE_API, SYSTEM_API } from '../../api';

export default (ID, service = '') => {
    const suffix = service.toUpperCase();
    const SERVICE = capitalize(service);
    const getOrgTreeOK = createAction(`${ID}_GET_ORG_OK_${suffix}`);
    const getOrgTree = createFetchAction(`${SYSTEM_API}/orgtree`, [
        getOrgTreeOK
    ]);
    // 升级后的接口
    // 分类获取数据
    const getOrgTreeByOrgType = createFetchAction(
        `${SYSTEM_API}/orgtree?orgtype={{orgtype}}`,
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

    const postOrg = createFetchAction(`${SERVICE_API}/orgs/`, 'POST');
    const putOrg = createFetchAction(
        `${SERVICE_API}/orgs/code/{{code}}/?this=true`,
        'PUT'
    );
    const deleteOrg = createFetchAction(
        `${SERVICE_API}/orgs/code/{{code}}/?this=true`,
        'DELETE'
    );
    const getOrgParent = createFetchAction(
        `${SERVICE_API}/orgs/code/{{code}}/?parent=true`,
        'GET'
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
    orgReducer[`get${SERVICE}OrgParent`] = getOrgParent;
    orgReducer[`get${SERVICE}OrgTreeByOrgType`] = getOrgTreeByOrgType;
    orgReducer[`get${SERVICE}ParentOrgTreeByID`] = getParentOrgTreeByID;
    orgReducer[`get${SERVICE}ChildOrgTreeByID`] = getChildOrgTreeByID;

    return orgReducer;
};
