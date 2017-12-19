import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction'
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import {base,WORKFLOW_API,WORKFLOW_CODE} from '_platform/api'
const code = WORKFLOW_CODE.安全隐患上报流程;
export const ID = 'HIDDENDANGER';

const setIsAddPlan =  createAction ('安全隐患-设置新增状态');
//export const setCurrentAcc =  createAction ('事故登记-设置当前事故');
const setAddModalVisiblePlan = createAction('安全隐患-设置添加内容操作窗可视性');

//上传文件
const getPotentialRiskByCode = createFetchAction(`${base}/main/api/potential-risk/?unit_code={{code}}&status={{status}}&keyword={{keyword}}`,[],'GET');
const getWrokflowByID = createFetchAction(`${WORKFLOW_API}/instance?code={{code}}&subject_id={{id}}&detail=true`);
export const actions = {
	getPotentialRiskByCode,
    getWrokflowByID
};

export default handleActions({
	[setIsAddPlan]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            isAddPlan: payload
        }
	},
	[setAddModalVisiblePlan]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            AddModalVisiblePlan:payload.AddModalVisiblePlan
        }
    }
}, {});
