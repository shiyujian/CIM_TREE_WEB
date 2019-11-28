import asideReducer, * as asideActions from './aside';
import previewReducer, * as previewActions from './preview';
import tabsReducer, * as tabsActions from './tabs';
import treeReducer, * as treeActions from './tree';
import amapReducer, * as amapActions from './amap';

import { handleActions, combineActions } from 'redux-actions';
import {
    taskFactory,
    tasksFactory,
    usersFactory,
    workflowAction,
    orgFactory,
    rolesFactory,
    docFactory
} from '../higher-order';
import { actionsMap } from '../util';

const ID = 'SINGLETON';
const orgReducer = orgFactory(ID);
const rolesReducer = rolesFactory(ID);
const taskReducer = taskFactory(ID);
const tasksReducer = tasksFactory(ID);
const usersReducer = usersFactory(ID);
const docReducer = docFactory(ID);

export const actions = {
    ...asideActions,
    ...previewActions,
    ...tabsActions,
    ...taskReducer,
    ...tasksReducer,
    ...usersReducer,
    ...orgReducer,
    ...rolesReducer,
    ...workflowAction,
    ...treeActions,
    ...amapActions,
    ...docReducer
    // ...progressActions
};

export default handleActions(
    {
        [combineActions(...actionsMap(asideActions))]: (state, action) => ({
            ...state,
            aside: asideReducer(state.aside, action)
        }),
        [combineActions(...actionsMap(previewActions))]: (state, action) => ({
            ...state,
            preview: previewReducer(state.preview, action)
        }),
        [combineActions(...actionsMap(tabsActions))]: (state, action) => ({
            ...state,
            tabs: tabsReducer(state.tabs, action)
        }),
        [combineActions(...actionsMap(treeActions))]: (state, action) => ({
            ...state,
            tree: treeReducer(state.tree, action)
        }),
        [combineActions(...actionsMap(amapActions))]: (state, action) => ({
            ...state,
            amap: amapReducer(state.amap, action)
        }),
        [combineActions(...actionsMap(taskReducer))]: (state, action) => ({
            ...state,
            task: taskReducer(state.task, action)
        }),
        [combineActions(...actionsMap(tasksReducer))]: (state, action) => ({
            ...state,
            tasks: tasksReducer(state.tasks, action)
        }),
        [combineActions(...actionsMap(usersReducer))]: (state, action) => ({
            ...state,
            users: usersReducer(state.users, action)
        }),
        [combineActions(...actionsMap(orgReducer))]: (state, action) => ({
            ...state,
            org: orgReducer(state.org, action)
        }),
        [combineActions(...actionsMap(rolesReducer))]: (state, action) => ({
            ...state,
            roles: rolesReducer(state.roles, action)
        }),
        [combineActions(...actionsMap(docReducer))]: (state, action) => ({
            ...state,
            doc: docReducer(state.doc, action)
        })
    },
    {}
);
