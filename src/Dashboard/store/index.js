import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';
import { SERVICE_API,base,USER_API,WORKFLOW_API} from '_platform/api';
import { FOREST_API} from '_platform/api';
const ID = 'index';
export const getAreaOK = createAction('获取组织机构树');
export const getTreeOK = createAction(`${ID}_getTreeOK`);
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]);
export const getArea = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getAreaOK]);
export const getTrack = createFetchAction(`${base}/main/api/user/{{ID}}/location/`,[]);
export const getRisk = createFetchAction(`${base}/main/api/potential-risk/?status=1`,[]);
export const getVedio = createFetchAction(`${SERVICE_API}/loc-tree/code/CAM_ROOT/`,[]);
export const getSafeMonitor = createFetchAction(`${SERVICE_API}/monitors/code/`,[]);
export const getUsers = createFetchAction(`${USER_API}/users/`,[]);
export const getUsersOnline = createFetchAction(`${base}/main/api/users-online/?interval=30&minlat={{minlat}}&maxlat={{maxlat}}&minlng={{minlng}}&maxlng={{maxlng}}`,[]);
export const getUserOrgInfo = createFetchAction(`${SERVICE_API}/persons/code/{{CODE}}/?all=true`,[]);
export const getOrgs = createFetchAction(`${SERVICE_API}/org-tree/`,[]);
export const getOrgsByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{CODE}}/`,[]);
export const getRiskProcess = createFetchAction(`${WORKFLOW_API}/instance/`,[]);//获取隐患处理工单
export const getRiskProcessDetail = createFetchAction(`${WORKFLOW_API}/instance/{{ID}}`,[]);//获取隐患工单详情
export const getRiskContactSheet = createFetchAction(`${base}/main/api/potential-risk/{{ID}}/contact-sheet/`,[]);
export const getCameraTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, []);
// 获取设计图纸信息流程
export const getWKsOk = createAction('获取流程成功');
export const getWks = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[]);
const getDesignStage = createFetchAction(`${SERVICE_API}/metalist/designstage/`,[]);
//批量获取设计成果
const getDocumentList = createFetchAction(`${SERVICE_API}/documentgetlist/`,[]);
//批量模型下载地址
const getImodelInfoAc = createFetchAction(`${SERVICE_API}/documents/code/{{pk}}/?all=true`,[]);
//获取安全规则制度
// http://bimcd.ecidi.com:6544/service/construction/api/workpackages/code/11112341/?all=true
// http://bimcd.ecidi.com:6544/service/construction/api/documents/code/safetytestfile201710301635170/?all=true
const getWorkpackages = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
//获取安全隐患
const getRiskAll = createFetchAction(`${base}/main/api/potential-risk/`,[]);
//----质量管理的模块代码
export const getChildrenOrgTree = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&depth=4`, []);
export const fetchDefectDataByLoc = createFetchAction(`${base}/main/api/quality-defect/?project_location={{keyword}}`,[])
//----质量管理的模块代码
//获取360全景图地址
const getVideo360List = createFetchAction(`${SERVICE_API}/metalist/video360list/`, []);

export const actions = {
	getTreeOK,
	getTree,
	getAreaOK,
	getArea,
	getTrack,
	getRisk,
	getVedio,
	getSafeMonitor,
	getUsers,
	getUsersOnline,
	getUserOrgInfo,
	getOrgs,
	getRiskProcess,
	getRiskProcessDetail,
	getRiskContactSheet,
	getOrgsByCode,
	getWks,
	getWKsOk,
	getDocumentList,
	getCameraTree,
	getDesignStage,
	getImodelInfoAc,
	getWorkpackages,
	getRiskAll,
	getChildrenOrgTree,
	fetchDefectDataByLoc,
	getVideo360List,
};
export default handleActions({
	[getTreeOK]: (state, {payload}) => {
		return {
			...state,
			treeLists: [payload]
		}
	},
	[getAreaOK]: (state, {payload}) => {
		return {
			...state,
			areaLists: payload.children
		}
	},
	getWKsOk:(state,{payload})=>{
        
        return {
            ...state
        }
    }
}, {});
