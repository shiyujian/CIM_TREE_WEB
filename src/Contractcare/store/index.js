import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API,base,USER_API,WORKFLOW_API} from '_platform/api';

const ID = 'contract';
export const setkeycode = createAction(`${ID}_setkeycode`);
export const actions = {
	setkeycode,
};
export default handleActions({
	[setkeycode]: (state, {payload}) => {
	    return {
	    	...state,
	    	keycode: payload
	    }
    }
}, {});