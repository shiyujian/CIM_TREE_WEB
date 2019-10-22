import { createAction, handleActions } from 'redux-actions';
import fetchAction from 'fetch-action';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import { OSSUPLOAD_API, SYSTEM_API } from '_platform/api';
const ID = 'OVERALL_DISPATCH';
// 是否获取数据
export const setGetMessageStatus = createAction(`${ID}设置是否获取数据`);
// 上传附件
export const uploadFileHandler = myFetch(`${OSSUPLOAD_API}?filetype=news`, [], 'POST');
// 现场发文查询
export const getDispatchs = fetchAction(`${SYSTEM_API}/dispatchs`);
// 现场收文查询
export const getReceipts = fetchAction(`${SYSTEM_API}/receipts`);
// 现场发文
export const postDddDispatch = fetchAction(`${SYSTEM_API}/adddispatch`, [], 'POST');
// 现场发文删除
export const deleteDispatch = fetchAction(`${SYSTEM_API}/deletedispatch/{{id}}`, [], 'DELETE');
export const actions = {
    setGetMessageStatus,
    uploadFileHandler,
    getDispatchs,
    getReceipts,
    postDddDispatch,
    deleteDispatch
};
export default handleActions({
    [setGetMessageStatus]: (state, { payload }) => ({
        ...state,
        getMessageStatus: payload
    })
}, {});
