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
// 设置区域地块树，对于所有人员获取所有的数据
export const getOnSiteThinClassTree = createAction(`${ID}所有的区域地块细班树`);
// 设置区域地块树，对于施工监理只获取自己标段的数据
export const getThinClassTree = createAction(`${ID}关于标段的区域地块细班树`);
export const getTotalThinClass = createAction(`${ID}获取所有的小班数据`);

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

export const getTreearea = createFetchAction(`${FOREST_API}/route/thinclasses?`);

export default handleActions(
    {
        [getTreeNodeListOK]: (state, { payload }) => {
            let projectList = [];
            let sectionList = [];
            if (payload instanceof Array && payload.length > 0) {
                payload.map(node => {
                    if (node.Type === '项目工程') {
                        projectList.push({
                            Name: node.Name,
                            No: node.No
                        });
                    } else if (node.Type === '单位工程') {
                        let noArr = node.No.split('-');
                        if (noArr && noArr instanceof Array && noArr.length === 3) {
                            sectionList.push({
                                Name: node.Name,
                                No: node.No,
                                Parent: noArr[0]
                            });
                        }
                    }
                });
                for (let i = 0; i < projectList.length; i++) {
                    projectList[i].children = sectionList.filter(node => {
                        return node.Parent === projectList[i].No;
                    });
                }
            }
            return {
                ...state,
                bigTreeList: projectList
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
        [getOnSiteThinClassTree]: (state, { payload }) => {
            return {
                ...state,
                onSiteThinClassTree: payload
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
