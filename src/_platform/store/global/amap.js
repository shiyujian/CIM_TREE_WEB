import { createAction, handleActions } from 'redux-actions';
import createFetchAction from 'fetch-action';
import {
    LBSAMAP_API,
    LBSAMAP_KEY
} from '../../api';
const ID = 'amap';

export const getAmapLocation = createAction(`${ID}获取地理位置信息`);

// 地理位置获取
export const getLocationName = createFetchAction(`${LBSAMAP_API}/v3/geocode/regeo?key=${LBSAMAP_KEY}&s=rsv3&location={{location}}&radius=2800&callback=&platform=JS&logversion=2.0&sdkversion=1.3&appname=http%3A%2F%2Flbs.amap.com%2Fconsole%2Fshow%2Fpicker&csid=49851531-2AE3-4A3B-A8C8-675A69BCA316`, [], 'GET');
// 坐标系转换
export const getGcjbyGps = createFetchAction(`${LBSAMAP_API}/v3/assistant/coordinate/convert?key=${LBSAMAP_KEY}&locations={{locations}}&coordsys=gps`, [], 'GET');
// 根据坐标获取地址信息
export const getLocationNameByCoordinate = createFetchAction(`${LBSAMAP_API}/v3/geocode/regeo`, [], 'GET');

// 根据输入搜索位置信息
export const getLocationDataByLocationName = createFetchAction(`${LBSAMAP_API}/v3/place/text`, [], 'GET');

export default handleActions(
    {
        [getAmapLocation]: (state, { payload }) => {
            return {
                ...state,
                amapLocation: payload
            };
        }
    },
    []
);
