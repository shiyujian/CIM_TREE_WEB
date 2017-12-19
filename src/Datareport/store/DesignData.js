import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from './fetchAction';
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';

export const ID = 'DATA_DESIGNDATA';

const additionReducer = fieldFactory(ID, 'addition');
const checkReducer = fieldFactory(ID, 'check');
const modifyReducer = fieldFactory(ID, 'modify');
const expurgateReducer = fieldFactory(ID, 'expurgate');

const getFieldsOK = createAction(`${ID}_GET_FIELD_OK`);

export const actions = {
	...additionReducer,
	...checkReducer,
	...modifyReducer,
	...expurgateReducer,
};

export default handleActions({
	[combineActions(...actionsMap(additionReducer))]: (state, action) => ({
		...state,
		addition: additionReducer(state.addition, action),
    }),
    [combineActions(...actionsMap(checkReducer))]: (state, action) => ({
		...state,
		check: checkReducer(state.check, action),
	}),
	[combineActions(...actionsMap(modifyReducer))]: (state, action) => ({
		...state,
		modify: modifyReducer(state.modify, action),
	}),
	[combineActions(...actionsMap(expurgateReducer))]: (state, action) => ({
		...state,
		expurgate: expurgateReducer(state.expurgate, action),
	}),
	[getFieldsOK]: (state, {payload: {results = []} = {}}) => ({
		...state,
		fields: results
	})
}, {});
