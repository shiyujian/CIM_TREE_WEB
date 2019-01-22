import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃列表
export const getThinClass = forestFetchAction(`${FOREST_API}/route/thinclasses`); // 查询细班数据
export const shapeUploadHandler = myFetch(`${FOREST_API}/ShapeUploadHandler.ashx?layername={{name}}`, [], 'POST'); // 导入细班/地块数据
export const importThinClass = forestFetchAction(`${FOREST_API}/route/importland`, [], 'POST'); // 地块批量上报

export const actions = {
    getNurseryList,
    getThinClass,
    shapeUploadHandler,
    importThinClass
};

export default handleActions({
}, {});
