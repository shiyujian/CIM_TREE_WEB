/**
 * Created by tinybear on 17/9/18.
 * 设计变更
 */

import {handleActions, combineActions,createAction} from 'redux-actions';


const selectUnit = createAction('选择项目');
const setResults = createAction('设置查询到的成果');

export const actions = {
    selectUnit,
    setResults
};

export default handleActions({
    [selectUnit]: (state, {payload}) => {
        let {project,unitProject} = payload;

        return{
            ...state,
            project:{value:project.value,label:project.label,code:project.code},
            unitProject:{value:unitProject.value,label:unitProject.label,code:unitProject.code}
        }
    },
    [setResults]:(state,{payload}) => {
        let {data,drawings} = payload;
        return {
            ...state,
            drawings,
            data
        }
    }
}, {});