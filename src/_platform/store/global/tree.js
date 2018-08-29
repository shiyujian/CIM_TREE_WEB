import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import { FOREST_API } from '../../api';
import { getUser } from '_platform/auth';

export const getTreeNodeListOK = createAction('获取森林大数据树节点');
export const getTreeNodeList = createFetchAction(
    `${FOREST_API}/tree/wpunittree`,
    [getTreeNodeListOK]
); //    √
export const getLittleClassOK = createAction('获取森林大数据树小班细班信息');
export const getLittleClass = createFetchAction(
    `${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`,
    [getLittleClassOK]
);
export const getProjectListOK = createAction(
    '获取进度管理左侧项目工程节点信息'
);
export const getProjectList = createFetchAction(
    `${FOREST_API}/tree/wpunittree`,
    [getProjectListOK]
); //    √
export const getScheduleTaskListOK = createAction(
    '获取进度管理流程填报根据标段筛选左侧项目工程节点信息'
);
export const getScheduleTaskList = createFetchAction(
    `${FOREST_API}/tree/wpunittree`,
    [getScheduleTaskListOK]
); //    √

export default handleActions(
    {
        // [getTreeNodeListOK]: (state, {payload}) => {
        // 	let user = getUser();
        // 	if(user && user.sections){
        // 		if(JSON.parse(user.sections).length === 0){
        // 			let root = [];
        // 			if (payload instanceof Array && payload.length > 0) {
        // 				let level2 = [];
        // 				root = payload.filter(node => {
        // 					return node.Type === '项目工程' ;
        // 				})
        // 				level2 = payload.filter(node => {
        // 					return node.Type === '子项目工程' ;
        // 				})
        // 				for (let i = 0; i<root.length; i++){
        // 					root[i].children = level2.filter(node => {
        // 						return node.Parent === root[i].No;
        // 					})
        // 				}
        // 			}
        // 			return {
        // 				...state,
        // 				bigTreeList: root
        // 			}
        // 		}else{
        // 			let sections = JSON.parse(user.sections);
        // 			let proj = sections[0].substr(0,4);
        // 			let unitProj = [];
        // 			sections.map(item => {
        // 				unitProj.push(item.substr(0,7))
        // 			})
        // 			let root = [];
        // 			if (payload instanceof Array && payload.length > 0) {
        // 				let level2 = [];
        // 				root = payload.filter(node => {
        // 					return node.Type === '项目工程' && node.No === proj;
        // 				})
        // 				level2 = payload.filter(node => {
        // 					return node.Type === '子项目工程' && unitProj.indexOf(node.No) !== -1;
        // 				})
        // 				for (let i = 0; i<root.length; i++){
        // 					root[i].children = level2.filter(node => {
        // 						return node.Parent === root[i].No;
        // 					})
        // 				}
        // 			}
        // 			return {
        // 				...state,
        // 				bigTreeList: root
        // 			}
        // 		}
        // 	}else{
        // 		let root = [];
        // 		if (payload instanceof Array && payload.length > 0) {
        // 			let level2 = [];
        // 			root = payload.filter(node => {
        // 				return node.Type === '项目工程' ;
        // 			})
        // 			level2 = payload.filter(node => {
        // 				return node.Type === '子项目工程' ;
        // 			})
        // 			for (let i = 0; i<root.length; i++){
        // 				root[i].children = level2.filter(node => {
        // 					return node.Parent === root[i].No;
        // 				})
        // 			}
        // 		}
        // 		return {
        // 			...state,
        // 			bigTreeList: root
        // 		}
        // 	}

        // },
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
        [getLittleClassOK]: (state, { payload }) => {
            return {
                ...state,
                littleClass: payload
            };
        }
    },
    []
);
