import { createAction, handleActions, combineActions } from 'redux-actions';
//
import { actionsMap } from '_platform/store/util';
import newsReducer, { actions as newsActions } from './news';
import datumReducer, { actions as datumActions } from './datum';

export default handleActions(
    {
        [combineActions(...actionsMap(newsActions))]: (state, action) => {
            return { ...state, news: newsReducer(state.news, action) };
        },
        [combineActions(...actionsMap(datumActions))]: (state, action) => {
            return { ...state, datum: datumReducer(state.datum, action) };
        }
    },
    {}
);
