import { createAction, handleActions, combineActions } from 'redux-actions';
import createFetchAction from './fetchAction';
import fetchAction from 'fetch-action';
import { FLOW_API } from '_platform/api';

// 2019-7-23两库合并新接口
// 获取待办任务列表
export const getWorkList = fetchAction(`${FLOW_API}/works`, [], 'GET');
export const actions = {
    getWorkList
};
export default handleActions(
    {

    },
    {}
);
