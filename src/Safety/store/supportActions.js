import {handleActions, combineActions, createAction} from 'redux-actions';
import createFetchAction from 'fetch-action';
import {createFetchActionWithHeaders} from './fetchAction'
import {actionsMap} from '_platform/store/util';
import fieldFactory from '_platform/store/service/field';
import { SERVICE_API,base,USER_API,WORKFLOW_API,FILE_API,FOREST_API} from '_platform/api'


//根据pk得到安全管控对象--单位资质
export const getVerificationByCode = 
    createFetchAction(`${base}/main/api/unit-certificate/{{code}}`,[],'GET');
//新建一个安全管控对象
export const putVerification = 
    createFetchAction(`${base}/main/api/unit-certificate/`,[],'POST');
    //得到施工包对象：
export const getWkByCode = 
    // createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`, [], 'GET');
    createFetchAction(`${FOREST_API}/tree/wpunits?parent={{parent}}`,[],'GET');
//删除一个安全管控对象
export const delVerfication = 
    createFetchAction(`${base}/main/api/unit-certificate/{{id}}/`,[],'DELETE');
    //根据pk得到安全管控对象--三类人员考核证资质
export const getPersonCertificate = 
    createFetchAction(`${base}/main/api/person-certificate/{{code}}`,[],'GET');
//新建一个安全管控对象
export const addPersonCertificate = 
    createFetchAction(`${base}/main/api/person-certificate/`,[],'POST');
//删除一个安全管控对象
export const delPersonCertificate = 
    createFetchAction(`${base}/main/api/person-certificate/{{id}}/`,[],'DELETE');
    //根据pk得到安全管控对象--三类人员考核证资质
export const getWorkCertificate = 
    createFetchAction(`${base}/main/api/work-certificate/{{code}}`,[],'GET');
//新建一个安全管控对象
export const addWorkCertificate = 
    createFetchAction(`${base}/main/api/work-certificate/`,[],'POST');
//删除一个安全管控对象
export const delWorkCertificate = 
    createFetchAction(`${base}/main/api/work-certificate/{{id}}/`,[],'DELETE');
//入场教育
export const getSafetyEducation = 
    createFetchAction(`${base}/main/api/safety-education/{{code}}`,[]);
export const addSafetyEducation = 
    createFetchAction(`${base}/main/api/safety-education/`,[],'POST');
export const delSafetyEducation = 
    createFetchAction(`${base}/main/api/safety-education/{{id}}/`,[],'DELETE');
//作业人员安全教育
export const getSafetyWorkTrain = 
    createFetchAction(`${base}/main/api/safety-work-train/{{code}}`,[]);
export const addSafetyWorkTrain = 
    createFetchAction(`${base}/main/api/safety-work-train/`,[],'POST');
export const delSafetyWorkTrain = 
    createFetchAction(`${base}/main/api/safety-work-train/{{id}}/`,[],'DELETE');
//管理人员安全教育
export const getSafetyManageTrain = 
    createFetchAction(`${base}/main/api/safety-manage-train/{{code}}`,[]);
export const addSafetyManageTrain = 
    createFetchAction(`${base}/main/api/safety-manage-train/`,[],'POST');
export const delSafetyManageTrain = 
    createFetchAction(`${base}/main/api/safety-manage-train/{{id}}/`,[],'DELETE');
//安全技术交底
export const getSafetyDisclosure = 
    createFetchAction(`${base}/main/api/safety-disclosure/{{code}}`,[]);
export const addSafetyDisclosure = 
    createFetchAction(`${base}/main/api/safety-disclosure/`,[],'POST');
export const delSafetyDisclosure = 
    createFetchAction(`${base}/main/api/safety-disclosure/{{id}}/`,[],'DELETE');
//施工安全日记
export const getSafetyLog = 
    createFetchAction(`${base}/main/api/safety-log/{{code}}`,[]);
export const addSafetyLog = 
    createFetchAction(`${base}/main/api/safety-log/`,[],'POST');
export const patchSafetyLog = 
    createFetchAction(`${base}/main/api/safety-log/{{id}}/`,[],'PATCH');
export const delSafetyLog = 
    createFetchAction(`${base}/main/api/safety-log/{{id}}/`,[],'DELETE');
//安全活动记录
export const getSafetyActivity = 
    createFetchAction(`${base}/main/api/safety-activity/{{code}}`,[]);
export const addSafetyActivity = 
    createFetchAction(`${base}/main/api/safety-activity/`,[],'POST');
export const patchSafetyActivity = 
    createFetchAction(`${base}/main/api/safety-activity/{{id}}/`,[],'PATCH');
export const delSafetyActivity = 
    createFetchAction(`${base}/main/api/safety-activity/{{id}}/`,[],'DELETE');
//设备设施验收--进厂验收
export const getDeviceEnter = 
    createFetchAction(`${base}/main/api/device-enter/{{code}}`,[]);
export const addDeviceEnter = 
    createFetchAction(`${base}/main/api/device-enter/`,[],'POST');
export const delDeviceEnter = 
    createFetchAction(`${base}/main/api/device-enter/{{id}}/`,[],'DELETE');
//设备设施验收--设备设施验收
export const getDeviceDetect = 
    createFetchAction(`${base}/main/api/device-detect/{{code}}`,[]);
export const addDeviceDetect = 
    createFetchAction(`${base}/main/api/device-detect/`,[],'POST');
export const delDeviceDetect = 
    createFetchAction(`${base}/main/api/device-detect/{{id}}/`,[],'DELETE');
//安全检查
export const getSafetyCheckform = 
    createFetchAction(`${base}/main/api/safety-checkform/{{code}}`,[]);
export const addSafetyCheckform = 
    createFetchAction(`${base}/main/api/safety-checkform/`,[],'POST');
export const delSafetyCheckform = 
    createFetchAction(`${base}/main/api/safety-checkform/{{id}}/`,[],'DELETE');
export const getCheckContent = 
    createFetchAction(`${base}/main/api/safety-checkform/{{id}}/content/`,[]);
export const addCheckContent = 
    createFetchAction(`${base}/main/api/safety-checkform/{{id}}/content/`,[],'POST');
export const delCheckContent = 
    createFetchAction(`${base}/main/api/safety-checkcontent/{{id}}/`,[],'DELETE');
export const patchCheckContent = 
    createFetchAction(`${base}/main/api/safety-checkcontent/{{id}}/`,[],'PATCH');
export const actions = {
    getVerificationByCode,
    putVerification,
    getWkByCode,
    delVerfication,
    getPersonCertificate,
    delPersonCertificate,
    addPersonCertificate,
    addWorkCertificate,
    delWorkCertificate,
    getWorkCertificate,
    getSafetyEducation,
    addSafetyEducation,
    delSafetyEducation,
    getSafetyWorkTrain,
    addSafetyWorkTrain,
    delSafetyWorkTrain,
    getSafetyManageTrain,
    addSafetyManageTrain,
    delSafetyManageTrain,
    getSafetyDisclosure,
    addSafetyDisclosure,
    delSafetyDisclosure,
    getSafetyLog,
    addSafetyLog,
    delSafetyLog,
    patchSafetyLog,
    delSafetyActivity,
    getSafetyActivity,
    patchSafetyActivity,
    addSafetyActivity,
    getDeviceEnter,
    addDeviceEnter,
    delDeviceEnter,
    getDeviceDetect,
    addDeviceDetect,
    delDeviceDetect,
    getSafetyCheckform,
    addSafetyCheckform,
    delSafetyCheckform,
    getCheckContent,
    addCheckContent,
    delCheckContent,
    patchCheckContent
};

export default handleActions({
	/*[setIsAddPlan]:(state, {payload}) => {
		//debugger
        return {
            ...state,
            isAddPlan: payload
        }
	},*/
}, {});
