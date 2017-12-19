/**
 * Created by tinybear on 17/9/27.
 */
import {getUser} from '_platform/auth';
// import {PDF_FILE_API} from '_platform/api';
const location = window.location;

export default {}

export const parseWorkflowId = ()=>{
    let reg = /workflowID=(\d+)/;
    let matchs = location.search.match(reg);
    let [,wkId=''] = matchs||[];
    return wkId;
};

export const transUser = (user)=>{
    let {account} = user;
    return {
        "id": user.id,
        "username": user.username,
        "person_name": account.person_name,
        "person_code": account.person_code,
        "organization": account.organization
    }
};

export const getCurUser = ()=>{
    let currentUser = getUser();
    currentUser = {
        "id": parseInt(currentUser.id, 10),
        "username": currentUser.username,
        "person_name": currentUser.name,
        "person_code": currentUser.code,
        "organization": currentUser.org
    };
    return currentUser;
};

//防止选择单位工程后执行自动加载
export const isDisabledAutoLoad =()=>{
    let isDisabled = false;
    return {
        getValue:function() {
            return isDisabled;
        },
        setValue:function(val){
            isDisabled = val;
        }
    }
};

export const getPDFFiles = (text)=>{
    let res = [];
    if(text.CAD && text.CAD.name.indexOf('.pdf') !== -1){
        res.push(text.CAD);
    }
    if(text.PDF && text.PDF.name.indexOf('.pdf') !== -1){
        res.push(text.PDF);
    }
    if(text.BIM && text.BIM.name.indexOf('.pdf') !== -1){
        res.push(text.BIM);
    }
    if(text.attachmentFile && text.attachmentFile.name.indexOf('.pdf') !== -1){
        res.push(text.attachmentFile);
    }
    return res;
}

export const isJSON = item => {
    item = typeof item !== 'string'
        ? JSON.stringify(item)
        : item

    try {
        item = JSON.parse(item)
    } catch (e) {
        return false;
    }

    if (typeof item === 'object' && item !== null) {
        return true
    }

    return false
}

export const parseAll = obj => {
    if (typeof obj !== 'object')
        return obj
    let ret = {}
    for (let x in obj) {
        if (isJSON(obj[x])) {
            ret[x] = JSON.parse(obj[x])
        } else {
            ret[x] = obj[x]
        }
    }
    return ret;
}

export const DeisgnDirCode = window.DeathCode.DESIGN_DRAWING_DIR_CODE;
export const PlanDirCode = window.DeathCode.DESIGN_PLAN_DIR_CODE;
