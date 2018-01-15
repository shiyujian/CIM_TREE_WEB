import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from './fetchAction';
// import createFetchAction from 'fetch-action';
import {base, SERVICE_API} from '_platform/api';
const ID = 'trend';
export const getNewsListOK = createAction('安全首页获取新闻列表');

export const getNewsList = createFetchAction(`${base}/main/api/post/`, [getNewsListOK]);

export const getDatumListOK = createAction(`${ID}_getDatumList`);
export const getDatumList = createFetchAction(`${SERVICE_API}/recentdocs/`, [getDatumListOK]);
export const setnewdoc = createAction(`${ID}_setnewdoc`);
export const actions = {
    getNewsListOK,
    getNewsList,
	getDatumListOK,
	getDatumList,
	setnewdoc
};

export default handleActions(
    {
        [getNewsListOK]:(state,{payload})=> ({
        	...state,
        	newsList:payload
        }),
	    [getDatumListOK]: (state, {payload}) => ({
		    ...state,
		    Doc: payload.result
	    }),
	    [setnewdoc]: (state, {payload}) => ({
		    ...state,
		    NewDoc: payload
	    }),
    },
    {},
);