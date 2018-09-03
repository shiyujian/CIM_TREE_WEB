import { createAction, handleActions } from 'redux-actions';
import createFetchAction from './dispatchFetchAction';
import createFetchActionT from 'fetch-action';
import {
    base,
    USER_API,
    SERVICE_API,
    CODE_API
} from '_platform/api';
const ID = 'DISPATCH';
// Tab切换状态
export const setTabActive = createAction(`${ID}设置当前选中的tab`);
// 新闻列表的Tab切换状态
export const setNewsTabActive = createAction('新闻列表的Tab切换状态');

// 发送文件的modal
export const toggleModalAc = createAction(`${ID}发送文件的modal`);
// 上传的文件列表
export const postUploadFilesAc = createAction(`${ID}上传的文件列表`);
// 获取组织机构列表
export const getOrgListAcOK = createAction(`${ID}获取组织机构列表`);
export const getOrgListAc = createFetchActionT(
    `${SERVICE_API}/org-tree/?depth=3`,
    [getOrgListAcOK]
);
// 获取抄送的人员列表
export const getCopyUsersAcOK = createAction(`${ID}获取抄送的人员列表`);
export const getCopyUsersAc = createFetchActionT(
    `${USER_API}/users/?org_code={{code}}`,
    [getCopyUsersAcOK]
);
// 获取收文列表
export const getReceiveInfoAcOK = createAction(`${ID}获取收文列表`);
export const getReceiveInfoAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/received/?user={{user}}&per_page=10000`,
    [getReceiveInfoAcOK]
);
// 获取发送的列表
export const getSentInfoAcOK = createAction(`${ID}获取发送的列表`);
export const getSentInfoAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/sent/?user={{user}}&per_page=10000`,
    [getSentInfoAcOK]
);
// 发送文件
export const postSentDocAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/creation/`,
    [],
    'POST'
);
// 删除的发送文件
export const deleteSentDocAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/sent/{{id}}/?user={{user}}`,
    [],
    'DELETE'
);
// 获取收文的详情信息
export const getReceiveDetailAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`,
    []
);
// 获取发文的详情信息
export const getSendDetailAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/sent/{{id}}/?user={{user}}`,
    []
);
// 收文已阅
export const patchReceiveDetailAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`,
    [],
    'PATCH'
);
// 删除的收文
export const deleteReceiveDocAc = createFetchAction(
    `${CODE_API}/api/v1/file-notifications/received/{{id}}/?user={{user}}`,
    [],
    'DELETE'
);
// 发送短信接口
export const sentMessageAc = createFetchAction(
    `${CODE_API}/api/v1/sms/`,
    [],
    'POST'
);

// 存储table回文信息
export const setDocInfo = createAction('table回文信息');

// 获取施工单位列表
const getOrgTreeOK = createAction('DIS获取施工单位列表');
const getOrgTree = createFetchAction(`${SERVICE_API}/org-tree/`, [
    getOrgTreeOK
]);

// 获取部门信息
const getOrgName = createFetchAction(
    `${SERVICE_API}/orgs/code/{{code}}/`,
    [],
    'GET'
);
const loop = (data = [], dataSource = [], datas = []) => {
    return data.map(item => {
        if (item.children && item.children.length) {
            loop(item.children, dataSource, datas);
        }

        for (let j = 0; j < dataSource.length; j++) {
            const element = dataSource[j];
            if (item.code == element.from_whom) {
                datas.push({ name: item.name, code: item.code });
            } else if (element.from_whom == 'admin') {
                datas.push({ name: 'admin', code: 'admin' });
            }
        }
    });
};

const loops = (data = [], dataSource = [], datas = [], ccdata = []) => {
    return data.map(item => {
        if (item.children && item.children.length) {
            loops(item.children, dataSource, datas, ccdata);
        }

        for (let j = 0; j < dataSource.length; j++) {
            const element = dataSource[j];
            if (item.code == element.extend_to_whom_list[0]) {
                datas.push({ name: item.name, code: item.code });
            }
            if (item.code == element.extend_cc_list[0]) {
                ccdata.push({ name: item.name, code: item.code });
            }
        }
    });
};
export const actions = {
    setDocInfo,
    setTabActive,
    getReceiveInfoAcOK,
    getReceiveInfoAc,
    getSentInfoAcOK,
    getSentInfoAc,
    toggleModalAc,
    postUploadFilesAc,
    postSentDocAc,
    deleteSentDocAc,
    getReceiveDetailAc,
    getSendDetailAc,
    patchReceiveDetailAc,
    deleteReceiveDocAc,
    sentMessageAc,
    getOrgListAcOK,
    getOrgListAc,
    getCopyUsersAcOK,
    getCopyUsersAc,
    getOrgName,

    getOrgTreeOK,
    getOrgTree,

    setNewsTabActive
};

export default handleActions(
    {
        [setDocInfo]: (state, { payload }) => ({
            ...state,
            setDocInfos: payload
        }),
        [setTabActive]: (state, { payload }) => ({
            ...state,
            tabValue: payload
        }),
        [getOrgListAcOK]: (state, { payload }) => ({
            ...state,
            orgList: payload.children
        }),
        [getCopyUsersAcOK]: (state, { payload }) => ({
            ...state,
            copyUsersList: payload
        }),
        [toggleModalAc]: (state, { payload }) => ({
            ...state,
            toggleData: payload
        }),
        [getReceiveInfoAcOK]: (state, { payload }) => {
            const user = JSON.parse(
                window.localStorage.getItem('QH_USER_DATA')
            );

            let datas = [];
            loop(state.orgList, payload.notifications, datas);
            if (datas && datas.length > 0) {
                payload.notifications.map((dat, index) => {
                    // if (dat.from_whom == datas[0].code) {
                    // 	dat.to_whom_name = datas[0].name
                    // }
                    for (let i = 0; i < datas.length; i++) {
                        const elementdatas = datas[i];
                        if (dat.from_whom == elementdatas.code) {
                            dat.to_whom_name = elementdatas.name;
                        }
                    }
                });
            }
            return {
                ...state,
                receiveInfo: payload
            };
        },
        [getSentInfoAcOK]: (state, { payload }) => {
            let datas = [];
            let ccdata = [];

            loops(state.orgList, payload.notifications, datas, ccdata);
            if (datas && datas.length > 0) {
                payload.notifications.map((dat, index) => {
                    for (let j = 0; j < datas.length; j++) {
                        const elementdatas = datas[j];
                        if (dat.extend_to_whom_list[0] == elementdatas.code) {
                            dat.to_whom_s = elementdatas.name;
                        }
                    }
                    for (let z = 0; z < ccdata.length; z++) {
                        const elementccdata = ccdata[z];
                        if (dat.extend_cc_list[0] == elementccdata.code) {
                            dat.cc_whom_s = elementccdata.name;
                        }
                    }
                });
            }
            return {
                ...state,
                sendInfo: payload
            };
        },
        [postUploadFilesAc]: (state, { payload }) => ({
            ...state,
            fileList: payload
        }),

        [getOrgTreeOK]: (state, { payload }) => ({
            ...state,
            orgList: payload.children
        })
    },
    {}
);
