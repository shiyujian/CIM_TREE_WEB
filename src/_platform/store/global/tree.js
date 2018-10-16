import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { FOREST_API } from '../../api';
import { getUser } from '_platform/auth';
const ID = 'tree';

export const getTreeNodeListOK = createAction(`${ID}获取森林大数据树节点`);
export const getTreeNodeList = createFetchAction(
    `${FOREST_API}/tree/wpunittree`,
    [getTreeNodeListOK]
); //    √
export const getLittleBanOK = createAction(`${ID}获取森林大数据树小班细班信息`);
export const getLittleBan = createFetchAction(
    `${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`,
    [getLittleBanOK]
);
export const getThinClassList = createFetchAction(`${FOREST_API}/tree/wpunit4apps?parent={{no}}`, []); //

export const getThinClassTree = createAction(`${ID}区域地块细班树`);
export const getTotalThinClass = createAction(`${ID}获取所有的小班数据`);

export const getProjectListOK = createAction(`${ID}获取进度管理左侧项目工程节点信息`);
export const getProjectList = createFetchAction(`${FOREST_API}/tree/wpunittree`, [getProjectListOK]); //    √
export const getScheduleTaskListOK = createAction(`${ID}获取进度管理流程填报根据标段筛选左侧项目工程节点信息`);
export const getScheduleTaskList = createFetchAction(`${FOREST_API}/tree/wpunittree`, [getScheduleTaskListOK]); //    √

// 获获取养护类型
export const getCuringTypes = createFetchAction(`${FOREST_API}/curing/curingtypes`, [], 'GET');
// 获获取养护类型
export const delCuringTask = createFetchAction(`${FOREST_API}/curing/curing/{{curingID}}`, [], 'DELETE');

// 苗木养护记录查询
export const getCuringTreeInfo = createFetchAction(`${FOREST_API}/curing/curingtrees`, []);

// 苗木养护计划详情
export const getCuringMessage = createFetchAction(`${FOREST_API}/curing/curing/{{id}}`, [], 'GET');

export const getForestAllUsersData = createFetchAction(
    `${FOREST_API}/system/users`,
    [],
    'GET'
);
export const getForestUserDetail = createFetchAction(
    `${FOREST_API}/system/user/{{id}}`,
    [],
    'GET'
);

export default handleActions(
    {
        [getTreeNodeListOK]: (state, { payload }) => {
            let user = getUser();
            if (user && user.sections) {
                if (JSON.parse(user.sections).length === 0) {
                    let root = [];
                    if (payload instanceof Array && payload.length > 0) {
                        let level2 = [];
                        root = payload.filter(node => {
                            return node.Type === '项目工程';
                        });
                    }
                    return {
                        ...state,
                        bigTreeList: root
                    };
                } else {
                    let sections = JSON.parse(user.sections);
                    let proj = sections[0].substr(0, 4);
                    let unitProj = [];
                    sections.map(item => {
                        unitProj.push(item.substr(0, 7));
                    });
                    let root = [];
                    if (payload instanceof Array && payload.length > 0) {
                        let level2 = [];
                        root = payload.filter(node => {
                            return node.Type === '项目工程' && node.No === proj;
                        });
                    }
                    return {
                        ...state,
                        bigTreeList: root
                    };
                }
            } else {
                let root = [];
                if (payload instanceof Array && payload.length > 0) {
                    let level2 = [];
                    root = payload.filter(node => {
                        return node.Type === '项目工程';
                    });
                    level2 = payload.filter(node => {
                        return node.Type === '子项目工程';
                    });
                    for (let i = 0; i < root.length; i++) {
                        root[i].children = level2.filter(node => {
                            return node.Parent === root[i].No;
                        });
                    }
                }
                return {
                    ...state,
                    bigTreeList: root
                };
            }
        },
        [getProjectListOK]: (state, { payload }) => {
            let nodeLevel = [];
            let root = [];
            if (payload instanceof Array && payload.length > 0) {
                root = payload.filter(node => {
                    return (
                        node.Type === '项目工程' &&
                        nodeLevel.indexOf(node.No) === -1 &&
                        nodeLevel.push(node.No)
                    );
                });
            }
            return {
                ...state,
                projectList: root
            };
        },
        [getScheduleTaskListOK]: (state, { payload }) => {
            let user = getUser();
            if (user && user.sections) {
                if (JSON.parse(user.sections).length === 0) {
                    let nodeLevel = [];
                    let root = [];
                    if (payload instanceof Array && payload.length > 0) {
                        root = payload.filter(node => {
                            return (
                                node.Type === '项目工程' &&
                                nodeLevel.indexOf(node.No) === -1 &&
                                nodeLevel.push(node.No)
                            );
                        });
                    }
                    return {
                        ...state,
                        scheduleTaskList: root
                    };
                } else {
                    let sections = JSON.parse(user.sections);
                    let proj = sections[0].substr(0, 4);
                    let root = [];
                    if (payload instanceof Array && payload.length > 0) {
                        root = payload.filter(node => {
                            return node.Type === '项目工程' && node.No === proj;
                        });
                    }
                    return {
                        ...state,
                        scheduleTaskList: root
                    };
                }
            } else {
                let nodeLevel = [];
                let root = [];
                if (payload instanceof Array && payload.length > 0) {
                    root = payload.filter(node => {
                        return (
                            node.Type === '项目工程' &&
                            nodeLevel.indexOf(node.No) === -1 &&
                            nodeLevel.push(node.No)
                        );
                    });
                }
                return {
                    ...state,
                    scheduleTaskList: root
                };
            }
        },
        [getLittleBanOK]: (state, { payload }) => {
            return {
                ...state,
                littleClass: payload
            };
        },
        [getThinClassTree]: (state, { payload }) => {
            return {
                ...state,
                thinClassTree: payload
            };
        },
        [getTotalThinClass]: (state, { payload }) => {
            return {
                ...state,
                totalThinClass: payload
            };
        }
    },
    []
);
