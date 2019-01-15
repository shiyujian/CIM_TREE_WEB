import {createAction, handleActions} from 'redux-actions';
import {FOREST_API} from '_platform/api';
import {createFetchActionWithHeaders as myFetch} from './myfetchAction';
import {forestFetchAction} from '_platform/store/fetchAction';

export const ID = 'suppliermanagement';
export const getNurseryList = forestFetchAction(`${FOREST_API}/system/nurserybases`); // 获取苗圃列表
export const shapeUploadHandler = myFetch(`${FOREST_API}/ShapeUploadHandler.ashx?layername={{name}}`, [], 'POST'); // 导入细班数据

export const actions = {
    getNurseryList,
    shapeUploadHandler
};

export default handleActions({
}, {});
