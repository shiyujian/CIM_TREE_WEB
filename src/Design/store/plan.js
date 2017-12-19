/**
 * Created by tinybear on 17/8/25.
 */
import {handleActions, combineActions,createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API,WORKFLOW_API,base,WORKFLOW_CODE} from '_platform/api';

const createPlanOK = createAction('新建计划成功');
const createPlan = createFetchAction(`${SERVICE_API}/documents/`,[createPlanOK], "POST");
const getWorkpackagesOk  = createAction(`获取施工包数据成功`);
const getWorkpackages = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`,[getWorkpackagesOk]);
const getPlan = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[]);
const getWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/`,[]);
const bindPlanWorkflow = createFetchAction(`${WORKFLOW_API}/instance/{{id}}/subject/`,[],"POST");
//service/workflow/api/instance/?code=TEMPLATE_013&executor=13066814098 查询当前执行人
const getPlanWKByUser = createFetchAction(`${WORKFLOW_API}/instance/?code={{template}}&executor={{username}}`,[]);
//按流程模板查询流程
const getPlanWk = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[]);
//更新计划
const updatePlan = createFetchAction(`${SERVICE_API}/documents/code/{{code}}/`,[],'PUT');
const getProfessionlistOK = createAction('获取专业列表成功');
const getProfessionlist = createFetchAction(`${SERVICE_API}/professlist/`,[getProfessionlistOK]);
//发起成果上报流程
const createReportWK = createFetchAction(`${base}/workflowapp/api/instance/{{pk}}/plan-callback/`,[],'POST');
//查询正在执行的任务
const getProcessingWK = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&executor={{id}}&code={{code}}`,[]);
//批量创建文档 批量创建设计成果
const createDocumentList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'POST');
//批量更新设计成果
const updateDocumentList = createFetchAction(`${SERVICE_API}/documentlist/`,[],'PUT');
//归档设计成果
const archiveDesign = createFetchAction(`${base}/workflowapp/api/instance/{{pk}}/archive/`,[],'POST');
//批量获取设计成果
const getDocumentList = createFetchAction(`${SERVICE_API}/documentgetlist/`,[]);
//获取设计阶段
const getDesignStageOK = createAction('获取设计阶段成功');
const getDesignStage = createFetchAction(`${SERVICE_API}/metalist/designstage/`,[getDesignStageOK]);
//获取近期提醒的设计填报流程
//?state_code=START&task=processing&code=TEMPLATE_015&subject_unit__contains=%22Q01V_02%22&deadline_lte=2017-10-28&deadline_gte=2017-09-15
const getNearWK = createFetchAction(`${WORKFLOW_API}/participant-task/?task=processing&code=${WORKFLOW_CODE.设计成果上报流程}`,[]);
// const setunitproject = createAction();
// http://bimcd.ecidi.com:6544/service/construction/api/projects/code/test231231/?children=true
//获取设计成果统计数据
const getWorkpackagesStatistics = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`,[]);
//更新设计成果统计数据
const putWorkpackagesStatistics =  createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/`, [],'PUT');

const getOrgTreeByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{code}}/`, []);

export const actions = {
    createPlan,
    createPlanOK,
    getWorkpackages,
    getWorkpackagesOk,
    getPlan,
    getWorkflow,
    bindPlanWorkflow,
    getPlanWKByUser,
    updatePlan,
    getProfessionlist,
    getProfessionlistOK,
    createReportWK,
    getProcessingWK,
    createDocumentList,
    updateDocumentList,
    archiveDesign,
    getNearWK,
    getPlanWk,
    getDocumentList,
    getDesignStage,
    getDesignStageOK,
    getWorkpackagesStatistics,
    putWorkpackagesStatistics,
    getOrgTreeByCode
};

export default handleActions({
    [createPlanOK]: (state, {payload}) => {
        return{
            ...state
        }
    },
    [getProfessionlistOK]:(state,{payload})=>{
        return {
            ...state,
            ...payload
        }
    },
    [getDesignStageOK]:(state,{payload})=>{
        const {metalist} = payload;
        let designStageEnum = {};
        if(metalist){
            metalist.forEach(m=>{
                designStageEnum[m.code] = m.name;
            });
        }
        return {
            ...state,
            designStageEnum:designStageEnum
        }
    },
    [getWorkpackagesOk]:(state,{payload})=>{
        let relateOrgs = payload.extra_params&&payload.extra_params.unit||[];
        return {
            ...state,
            relateOrgs
        }
    }
}, {});

