import { handleActions, createAction } from 'redux-actions';
import {
    QRCODE_API
} from '_platform/api';
import createFetchAction from 'fetch-action';
export const ID = 'Project_QRCodeDistribute';

// 获取二维码申请和审核列表
const getQrcodes = createFetchAction(`${QRCODE_API}/qrcodes`, [], 'GET');
// 获取二维码申请详情
const getQrcodeDetail = createFetchAction(`${QRCODE_API}/qrcode/{{ID}}`, [], 'GET');
// 二维码申请
const postQrcode = createFetchAction(`${QRCODE_API}/qrcode`, [], 'POST');
// 删除二维码申请列表数据
const deleteQrcode = createFetchAction(`${QRCODE_API}/qrcode/{{ID}}`, [], 'DELETE');
// 二维码审核
const postQrcodeCheck = createFetchAction(`${QRCODE_API}/qrcodecheck`, [], 'POST');
// 二维码库存查询
const getQrcodestores = createFetchAction(`${QRCODE_API}/qrcodestores`, [], 'GET');
// 二维码申请审核统计
const getQrcodestat = createFetchAction(`${QRCODE_API}/qrcodestat`, [], 'GET');
// 二维码编码量计算（起始值和结束值）
const getCalqrcodenum = createFetchAction(`${QRCODE_API}/calqrcodenum`, [], 'GET');
// 二维码编码量计算（通过起始值或者结束值）
const getCalqrcode = createFetchAction(`${QRCODE_API}/calqrcode`, [], 'GET');

export const actions = {
    // getTagsOK,
    // getTags,
    getQrcodes,
    getQrcodeDetail,
    postQrcode,
    deleteQrcode,
    postQrcodeCheck,
    getQrcodestores,
    getQrcodestat,
    getCalqrcodenum,
    getCalqrcode
};

export default handleActions({
    // [getTagsOK]: (state, { payload }) => ({
    //     ...state,
    //     tags: payload
    // })
}, {});
