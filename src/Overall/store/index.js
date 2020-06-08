import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import dispatchReducer, {actions as adispatchActions} from './dispatch';
import newsReducer, {actions as newsActions} from './news';
// 会议管理
import meetingmanageReducer, { actions as meetingmanageActions } from './Meeting/meetingmanage';
// 资料文档
import standardReducer, {actions as standardActions} from './Datum/standard';
import engineeringReducer, {actions as engineeringActions} from './Datum/engineering';
import rediosReducer, {actions as rediosActions} from './Datum/redios';
import interimReducer, {actions as interimActions} from './Datum/interim';
import trainingDocumentsReducer, {actions as trainingDocumentsActions} from './Datum/trainingDocuments';

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
    }),
    [combineActions(...actionsMap(standardActions))]: (state = {}, action) => ({
        ...state,
        standard: standardReducer(state.standard, action)
    }),
    [combineActions(...actionsMap(engineeringActions))]: (state = {}, action) => ({
        ...state,
        engineering: engineeringReducer(state.engineering, action)
    }),
    [combineActions(...actionsMap(rediosActions))]: (state = {}, action) => ({
        ...state,
        redios: rediosReducer(state.redios, action)
    }),
    [combineActions(...actionsMap(interimActions))]: (state = {}, action) => ({
        ...state,
        interim: interimReducer(state.interim, action)
    }),
    [combineActions(...actionsMap(trainingDocumentsActions))]: (state = {}, action) => ({
        ...state,
        trainingDocuments: trainingDocumentsReducer(state.trainingDocuments, action)
    })

}, {});
