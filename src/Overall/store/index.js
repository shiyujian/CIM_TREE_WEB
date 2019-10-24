import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import dispatchReducer, {actions as adispatchActions} from './dispatch';
import newsReducer, {actions as newsActions} from './news';
// 会议管理
import meetingmanageReducer, { actions as meetingmanageActions } from './Meeting/meetingmanage';

export default handleActions({
    [combineActions(...actionsMap(newsActions))]: (state, action) => {
        return {...state, news: newsReducer(state.news, action)};
    },
    [combineActions(...actionsMap(adispatchActions))]: (state, action) => {
        return {...state, dispatch: dispatchReducer(state.dispatch, action)};
    },
    // 会议管理
    [combineActions(...actionsMap(meetingmanageActions))]: (state = {}, action) => ({
        ...state,
        meetingmanage: meetingmanageReducer(state.meetingmanage, action)
    })

}, {});
