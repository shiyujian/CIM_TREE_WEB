import { createAction, handleActions } from 'redux-actions';
// import createFetchAction from 'fetch-action';
import {forestFetchAction} from '../fetchAction';
import {
    ROUTE_API,
    TREE_API,
    CURING_API
} from '../../api';
const ID = 'tree';

export const getTreeNodeListOK = createAction(`${ID}获取森林大数据树节点`);
export const getTreeNodeList = forestFetchAction(
    `${TREE_API}/wpunittree`,
    [getTreeNodeListOK]
); //
// 设置区域地块树，对于所有人员获取所有的数据
export const getOnSiteThinClassTree = createAction(`${ID}所有的区域地块细班树`);
// 设置区域地块树，对于施工监理只获取自己标段的数据
export const getThinClassTree = createAction(`${ID}关于标段的区域地块细班树`);
export const getTotalThinClass = createAction(`${ID}获取所有的小班数据`);
export const getThinClassList = forestFetchAction(`${TREE_API}/wpunit4apps?parent={{no}}`, []); //

// 获获取养护类型
export const getCuringTypes = forestFetchAction(`${CURING_API}/curingtypes`, [], 'GET');

// 苗木养护记录查询
export const getCuringTreeInfo = forestFetchAction(`${CURING_API}/curingtrees`, []);

// 苗木养护计划详情
export const getCuringMessage = forestFetchAction(`${CURING_API}/curing/{{id}}`, [], 'GET');

export const getTreearea = forestFetchAction(`${ROUTE_API}/thinclasses?`, [], 'GET'); // 获取细班详情

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
