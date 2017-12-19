import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from '../../fetchAction';
import {USER_API, SERVICE_API,TREE_CODE} from '_platform/api';
import {actionsMap} from '../../util';
import metaFactory from '../../_store/meta';
import documentsFactory from '../../_store/docs';
import userFactory from './user';
import documentFactory from '../../_store/doc';


const CODE = TREE_CODE.construction;
const ID = 'Quality_InspectFill';
// export const getUnitProjectOK = createAction('获取单位工程');
// export const getBranchProjectOK = createAction('获取分部工程');
// export const getPartialProjectOK = createAction('获取分项工程');
// //获取单位工程
// export const getUnitProject = createFetchAction(`${SERVICE_API}/projects/code/TSQV/?all=true`, [getUnitProjectOK]);
// //获取分部工程
// export const getBranchProject = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`, [getBranchProjectOK]);
// //获取分项工程
// export const getPartialProject = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`, [getPartialProjectOK]);
//获取major docType blueprintstage
const majorReducer = metaFactory(ID, 'major');
const docTypeReducer = metaFactory(ID, 'documenttype');
const blueprintstageReducer = metaFactory(ID, 'blueprintstage');
const documentsReducer = documentsFactory(ID);
const userReducer = userFactory(ID);
const documentReducer = documentFactory(ID);
//获取树状图
//获取树状图
export const getTreeListOK = createAction('${ID}_获取组织结构树');
export const getTreeList = createFetchAction(`${SERVICE_API}/dir-tree/code/${CODE}/`, [getTreeListOK]);
//获取当前code
export const setCurrentNode = createAction(`${ID}_设置当前的节点`);
export const toggleEditing =createAction('${ID}_获取isedit');

export const actions = {
            ...majorReducer,
            ...docTypeReducer,
            ...blueprintstageReducer,
            ...documentsReducer,
            ...userReducer,
            ...documentReducer,
            toggleEditing,
            getTreeList,
            setCurrentNode,
            getTreeListOK,
};

export default handleActions({
    [getTreeListOK](state,{payload: {children}}){
        let tree = [];
        children.map((children) => {
            tree.push({
                name:children.name,
                code:children.code,
                pk:children.pk
            });
        });
        return {
            ...state,
            tree
        }
    },
    // [getTreeListOK]:(state, {payload:{children}}) =>({
    //     ...state,
    //     tree:children
    // }),
    [toggleEditing]:(state, {payload}) =>({
        ...state,
        isAdd: payload,
    }),
    [setCurrentNode]: (state, {payload}) => ({
        ...state,
        currentNode: {code: payload},
    }),
    [combineActions(...actionsMap(majorReducer))]: (state, action) => ({
        ...state,
        majors: majorReducer(state.majors, action),
    }),
    [combineActions(...actionsMap(docTypeReducer))]: (state, action) => ({
        ...state,
        docTypes: docTypeReducer(state.docTypes, action),
    }),
    [combineActions(...actionsMap(blueprintstageReducer))]: (state, action) => ({
        ...state,
        blueprintstage: blueprintstageReducer(state.blueprintstage, action),
    }),
    [combineActions(...actionsMap(documentsReducer))]: (state, action) => ({
        ...state,
        documents: documentsReducer(state.documents, action),
    }),
    [combineActions(...actionsMap(userReducer))]: (state, action) => ({
        ...state,
        users: userReducer(state.users, action),
    }),
	// [getUnitProjectOK]: (state, {payload}) => {
	// 	return {
	// 		...state,
	// 		unitProject: payload.workpackages
	// 	}
	// },
	// [getBranchProjectOK]: (state, {payload}) => {
	// 	return {
	// 		...state,
	// 		branchProject: payload.children_wp
	// 	}
	// },
	// [getPartialProjectOK]: (state, {payload}) => {
	// 	return {
	// 		...state,
	// 		partialProject: payload.children_wp
	// 	}
	// },
}, {});
