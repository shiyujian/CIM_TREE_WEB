import {createAction, handleActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {
    WORKFLOW_API,
    VALIDATE_API,
    SYSTEM_API,
    TREE_API
} from '_platform/api';
const ID = 'LOGIN';

// 忘记密码 找回密码
const forgectOK = createAction('发送成功');

const getTasks = createFetchAction(`${WORKFLOW_API}/participant-task/`);

const loginForest = createFetchAction(`${SYSTEM_API}/login`, [], 'GET');

const getSecurityCode = createFetchAction(`${VALIDATE_API}`, [], 'GET');
// 获取APK更新
const getAPKUpdateInfo = createFetchAction(`${SYSTEM_API}/updateinfo?package=com.weimap.rfid.product&version=100&channel=wmap`, [], 'GET');

const getLoginTreeNodeListOK = createAction(`${ID}获取森林大数据树节点`);
const getLoginTreeNodeList = createFetchAction(`${TREE_API}/wpunittree`, [getLoginTreeNodeListOK], 'GET'); //
export const actions = {
    forgectOK,
    getTasks,
    loginForest,
    getSecurityCode,
    getAPKUpdateInfo,
    getLoginTreeNodeListOK,
    getLoginTreeNodeList
};
export default handleActions({
    [forgectOK]: (state, action) => {
        return {...state, userData: action.payload};
    },
    [getLoginTreeNodeListOK]: (state, { payload }) => {
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
            loginBigTreeList: projectList
        };
    }
}, {});
