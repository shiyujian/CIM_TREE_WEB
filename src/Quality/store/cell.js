import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import createFetchAction from 'fetch-action';
import { SERVICE_API, WORKFLOW_API} from '_platform/api';
import userFactory from '_platform/store/higher-order/users';
import workPackageFactory from '_platform/store/higher-order/wp';
import fieldFactory from '_platform/store/service/field';

export const ID = 'QUALITY_CELL';
const filterReducer = fieldFactory(ID, 'filter');
export const getTreeOK = createAction('${ID}_获取组织结构树');
export const getTree = createFetchAction(`${SERVICE_API}/project-tree/`, [getTreeOK]);
const userReducer = userFactory(ID);
const workPackageReducer = workPackageFactory(ID);
export const setPartPackages = createAction(`${ID}_设置部位工程施工包`);
export const getPartPackagesOK = createAction(`${ID}_获取部位工程施工包`);
export const getPartPackages = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?children=true`, [getPartPackagesOK]);
export const getFormdocumentOK = createAction(`${ID}_获取部位流程`);
export const getFormdocument = createFetchAction(`${WORKFLOW_API}/instance/`, [getFormdocumentOK]);
export const getnewpart =createAction(`${ID}_获取已经部位流程`);

export const actions = {
    getTree,
    getTreeOK,
    setPartPackages,
    getPartPackagesOK,
    getPartPackages,
    getFormdocumentOK,
    getFormdocument,
    getnewpart,
    ...userReducer,
    ...filterReducer,
    ...workPackageReducer
};

export default handleActions({
    [getTreeOK]: (state, {payload: {children}}) => ({
            ...state,
            tree: children
    }),
    [getPartPackagesOK]: (state, {payload}) => ({
        ...state,
        children: payload
    }),
    [setPartPackages]: (state, {payload}) => ({
        ...state,
        part: payload,
        oldpart:payload
    }),
    [getnewpart]: (state, {payload}) => ({
        ...state,
        part: payload,
    }),
    [getFormdocumentOK]: (state, {payload}) => {
        const part = state.part;
        let names=[];
        let status=[];
        payload.forEach(item => {
            names.push(item.subject[0].workContent);
            //status.push(item.status);
            const status = payload.some(q=>q.status === 2);
            const currentPart = part.find(p => p.name ===item.subject[0].qilocation);
            currentPart.status = status;
            currentPart.names = names;
        });
        return ({
            ...state,
            formdocument: payload,
            part // 更新part
        })
    },
    [combineActions(...actionsMap(userReducer))]: (state, action) => ({
        ...state,
        users: userReducer(state.users, action),
    }),
    [combineActions(...actionsMap(filterReducer))]: (state, action) => ({
        ...state,
        filter: filterReducer(state.filter, action),
    }),
    [combineActions(...actionsMap(workPackageReducer))]: (state, action) => ({
        ...state,
        workPackage: workPackageReducer(state.workPackage, action),
    }),
}, {});
