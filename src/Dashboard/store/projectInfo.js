
import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API,base,USER_API,WORKFLOW_API} from '_platform/api';

export default handleActions({
    getWKsOk:(state,{payload})=>{
        
        return {
            ...state
        }
    }
});
