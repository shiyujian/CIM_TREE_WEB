import {getUser} from '_platform/auth';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api.js'
const moment = require('moment'); 

export const launchProcess = (data,actions)=>{  //发起流程
    const {dataSource,selectUser,name} = data,
        {createWorkflow,logWorkflowEvent} = actions;
    
    const {id,username,person_name,person_code} = getUser(),
        creator = {id,username,person_name,person_code},
        postdata = {
            name,
            code:WORKFLOW_CODE["数据报送流程"],
            description:name,
            subject:[{
                data:JSON.stringify(dataSource)
            }],
            creator,
            plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
            deadline:null,
            status:"2"
        };
    
    createWorkflow({},postdata).then((rst) => {
        const {id: pk, current:{0:{id: currentId }}} = rst,
            {0:{to_state:{0:{id: stateId }}}} =  getNextStates(rst,currentId);
            
        logWorkflowEvent({pk:pk},{
            state:currentId,
            action:'提交',
            note:'发起填报',
            executor:creator,
            next_states:[{
                participants:[selectUser],
                remark:"",
                state:stateId
            }],
            attachment:null
        })
    })
}

export const addSerialNumber = (data=[])=>{
    let n = 1 ;
    return data.map(record =>{
        return Object.assign({},record,{
            index: n++
        })
    })
}