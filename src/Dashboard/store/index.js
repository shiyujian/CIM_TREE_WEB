import {createAction, handleActions, combineActions} from 'redux-actions';
import createFetchAction from 'fetch-action';


import { SERVICE_API,base,USER_API,WORKFLOW_API,FOREST_API} from '_platform/api';


export const getAreaOK = createAction('获取组织机构树');
export const getTreeOK = createAction(`first_getTreeOK`);
export const getTree = createFetchAction(`${FOREST_API}/tree/wpunits`, [getTreeOK]);
export const getTreearea =createFetchAction(`${FOREST_API}/route/thinclasses?`);
export const getArea = createFetchAction(`${SERVICE_API}/loc-tree/code/LOC_ROOT/`, [getAreaOK]);
export const getTrack = createFetchAction(`${base}/main/api/user/{{ID}}/location/`,[]);
export const getRisk = createFetchAction(`${FOREST_API}/tree/patrolevents`,[getRiskOK]);
export const getRiskOK = createAction(`获取安全隐患`);
export const getVedio = createFetchAction(`${SERVICE_API}/loc-tree/code/CAM_ROOT/`,[]);
export const getSafeMonitor = createFetchAction(`${SERVICE_API}/monitors/code/`,[]);
export const getUsers = createFetchAction(`${USER_API}/users/`,[]);
export const getUsersOnline = createFetchAction(`${base}/main/api/users-online/?interval=30&minlat={{minlat}}&maxlat={{maxlat}}&minlng={{minlng}}&maxlng={{maxlng}}`,[]);
export const getUserOrgInfo = createFetchAction(`${SERVICE_API}/persons/code/{{CODE}}/?all=true`,[]);
export const getOrgs = createFetchAction(`${SERVICE_API}/org-tree/`,[]);
export const getOrgsByCode = createFetchAction(`${SERVICE_API}/org-tree/code/{{CODE}}/`,[]);
export const getRiskProcess = createFetchAction(`${WORKFLOW_API}/instance/`,[]);//获取隐患处理工单


export const getTreeNodeList = createFetchAction(`${FOREST_API}/tree/wpunittree`, []); //    √
export const getLittleBan = createFetchAction(`${FOREST_API}/tree/wpunitsbysuffixno?no={{no}}`, []); //    
export const getRiskProcessDetail = createFetchAction(`${WORKFLOW_API}/instance/{{ID}}`,[]);//获取隐患工单详情
export const getRiskContactSheet = createFetchAction(`${base}/main/api/potential-risk/{{ID}}/contact-sheet/`,[]);

export const getCameraTree = createFetchAction(`${SERVICE_API}/project-tree/?depth=3`, []);

// 获取设计图纸信息流程
export const getWKsOk = createAction('获取流程成功');
export const getWks = createFetchAction(`${WORKFLOW_API}/instance/?code={{code}}`,[]);
const getDesignStage = createFetchAction(`${SERVICE_API}/metalist/designstage/`,[]);
//批量获取设计成果
const getDocumentList = createFetchAction(`${SERVICE_API}/documentgetlist/`,[])
//批量模型下载地址
const getImodelInfoAc = createFetchAction(`${SERVICE_API}/documents/code/{{pk}}/?all=true`,[]);
//获取安全规则制度
// http://bimcd.ecidi.com:6544/service/construction/api/workpackages/code/11112341/?all=true
// http://bimcd.ecidi.com:6544/service/construction/api/documents/code/safetytestfile201710301635170/?all=true
const getWorkpackages = createFetchAction(`${SERVICE_API}/workpackages/code/{{code}}/?all=true`,[]);
//获取安全隐患
const getRiskAll = createFetchAction(`${base}/tree/patrolevents`,[]);
//----质量管理的模块代码
export const getChildrenOrgTree = createFetchAction(`${SERVICE_API}/project-tree/code/{{code}}/?root=false&depth=4`, []);
export const fetchDefectDataByLoc = createFetchAction(`${base}/main/api/quality-defect/?project_location={{keyword}}`,[])
//----质量管理的模块代码
//获取360全景图地址
const getVideo360List = createFetchAction(`${SERVICE_API}/metalist/video360list/`, []);

//获取巡检路线
const getMapRouter = createFetchAction(`${FOREST_API}/tree/patrolroutes`, []);
//获取轨迹列表
const getMapList = createFetchAction(`${FOREST_API}/tree/patrolpositions?routeid={{routeID}}`, []);
//存储二维展示点击后弹框数据
export const getDimensional = createAction(`ssfirst_getDimensional`);

export const actions = {
	getDimensional,
	getTreeOK,
	getTree,
	getTreearea,
	getAreaOK,
	getArea,
	getTrack,
	getRisk,
	getRiskOK,
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
	getTreeNodeList,
	getLittleBan,
	
	getMapRouter,
	getMapList
};
export default handleActions({
	[getDimensional]: (state, {payload}) => {
		return {
			...state,
			dimensionalData: [payload]
		}
	},
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
	[getRiskOK]: (state, {payload}) => {
		return {
			...state,
			RiskLists: [payload]
		}
	},
	getWKsOk:(state,{payload})=>{
        
        return {
            ...state
        }
    }
}, {});
