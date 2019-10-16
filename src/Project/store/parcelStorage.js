import {createAction, handleActions} from 'redux-actions';
import {
    SHAPEUPLOAD_API,
    SYSTEM_API,
    ROUTE_API
} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${SYSTEM_API}/nurserybases`); // 获取苗圃列表
export const getThinClass = forestFetchAction(`${ROUTE_API}/thinclasses`); // 查询细班数据
export const shapeUploadHandler = myFetch(`${SHAPEUPLOAD_API}?layername={{name}}`, [], 'POST'); // 导入细班/地块数据
export const importThinClass = forestFetchAction(`${ROUTE_API}/importland`, [], 'POST'); // 地块批量上报

export const actions = {
    getNurseryList,
    getThinClass,
    shapeUploadHandler,
    importThinClass
};

export default handleActions({
}, {});
