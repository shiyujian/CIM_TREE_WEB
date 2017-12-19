import {createAction, handleActions, combineActions} from 'redux-actions';

import documentFactory from '_platform/store/higher-order/doc';

export const ID= 'docdispatch';
//Tab切换状态
export const setDocPutOrGetTabValue = createAction('设置当前选中的发出或者接受的tab值');
//新闻列表的Tab切换状态
export const setPutDocPageActive = createAction(`${ID}_发出文件Tab切换状态`);
//公告列表的Tab切换状态
export const setGetDocPageActive = createAction(`${ID}_接受文件Tab切换状态`);

export const setPutDocModalVaild = createAction('发出文件的modal');

const documentReducer = documentFactory(ID);


const setcurrentcode = createAction(`${ID}_CURRENTDODE`);


export const actions = {
    setDocPutOrGetTabValue,
    setGetDocPageActive,
    setPutDocPageActive,
    setPutDocModalVaild,
    ...documentReducer,
    setcurrentcode,
}

export default handleActions(
    {
        [setDocPutOrGetTabValue]:( state, {payload})=>({...state,docPutOrGetTabValue:payload}),
        [setGetDocPageActive]:( state, {payload})=>({...state,putDocTabValue:payload}),
        [setPutDocPageActive]:( state, {payload})=>({...state,getDocTabValue:payload}),
        [setPutDocModalVaild]:( state, {payload})=>({...state,putDocModalVaild:payload}),

    }
    ,
    {}
);