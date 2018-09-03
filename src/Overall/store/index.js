import {createAction, handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import materialReducer, {actions as materialActions} from './material';
import dispatchReducer, {actions as adispatchActions} from './dispatch';
import formmanageReducer, {actions as formmanageActions} from './formmanage';
import newsReducer, {actions as newsActions} from './news';

export default handleActions({
    [combineActions(...actionsMap(newsActions))]: (state, action) => {
        return {...state, news: newsReducer(state.news, action)};
    },
    [combineActions(...actionsMap(materialActions))]: (state, action) => {
        return {...state, material: materialReducer(state.material, action)};
    },
    [combineActions(...actionsMap(adispatchActions))]: (state, action) => {
        return {...state, dispatch: dispatchReducer(state.dispatch, action)};
    },
    [combineActions(...actionsMap(formmanageActions))]: (state, action) => {
        return {...state, formmanage: formmanageReducer(state.formmanage, action)};
    }

}, {});
