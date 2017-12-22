import {handleActions, combineActions} from 'redux-actions';
import {actionsMap} from '_platform/store/util';
import orgdataReducer, {actions as orgdataActions} from './orgdata';
import modaldataReducer, {actions as modaldataActions} from './ModalData';
import designdataReducer, {actions as designdataActions} from './DesignData';
import qualityDataReducer, {actions as qualityDataActions} from './quality';
import projectdataReducer, {actions as projectdataActions} from './projectData';
import persondataReducer, {actions as persondataActions} from './persondata';
import unitdataReducer, {actions as unitdataActions} from './unitdata';
import safetySpecialReducer, {actions as safetySpecialActions} from './safetySpecial';
import vediodataReducer, {actions as vediodataActions} from './vedioData';
import vedioinfodataReducer, {actions as vedioinfodataActions} from './vedioInfoData';
import workdataReducer, {actions as workdataActions} from './workdata';
import CostListDataReducer, {actions as CostListDataActions} from './CostListData';
import WorkunitCostReducer, {actions as WorkunitCostActions} from './WorkunitCost';
import safetyReducer, {actions as SafetyActions} from './safety';
import SumSpeedCostReducer, {actions as SumSpeedCostActions} from'./SumSpeedCost'
import SumPlanCostReducer, {actions as SumPlanCostActions} from'./SumPlanCost'
export default handleActions({
	//项目信息
	[combineActions(...actionsMap(projectdataActions))]: (state = {}, action) => ({
		...state,
		projectdata: projectdataReducer(state.projectdata, action),
	}),
	// 组织机构
	[combineActions(...actionsMap(orgdataActions))]: (state = {}, action) => ({
		...state,
		orgdata: orgdataReducer(state.orgdata, action),
	}),
	// 模型信息
	[combineActions(...actionsMap(modaldataActions))]: (state = {}, action) => ({
		...state,
		modaldata: modaldataReducer(state.modaldata, action),
	}),
	// 设计信息
	[combineActions(...actionsMap(designdataActions))]: (state = {}, action) => ({
		...state,
		designdata: designdataReducer(state.designdata, action),
	}),
	
	//质量信息
	[combineActions(...actionsMap(qualityDataActions))]: (state = {}, action) => ({
		...state,
		qualityData: qualityDataReducer(state.qualityData, action),
	}),
	//人员信息
	[combineActions(...actionsMap(persondataActions))]: (state = {}, action) => ({
		...state,
		persondata: persondataReducer(state.persondata, action),
	}),
	// 单位工程
	[combineActions(...actionsMap(unitdataActions))]: (state = {}, action) => ({
		...state,
		unitdata: unitdataReducer(state.unitdata, action),
	}),

	//视频监控
	[combineActions(...actionsMap(vediodataActions))]: (state = {}, action) => ({
		...state,
		vediodata: vediodataReducer(state.vediodata, action),
	}),
	//影像信息
	[combineActions(...actionsMap(vedioinfodataActions))]: (state = {}, action) => ({
		...state,
		vedioinfodata: vedioinfodataReducer(state.vedioinfodata, action),
	}),
	// 安全专项
	[combineActions(...actionsMap(safetySpecialActions))]: (state = {}, action) => ({
		...state,
		safetySpecial: safetySpecialReducer(state.safetySpecial, action),
	}),
	// 施工进度
	[combineActions(...actionsMap(workdataActions))]: (state = {}, action) => ({
		...state,
		workdata: workdataReducer(state.workdata, action),
	}),
	// 成本结算
	[combineActions(...actionsMap(CostListDataActions))]: (state = {}, action) => ({
		...state,
		CostListData: CostListDataReducer(state.CostListData, action),
	}),
	//工程量计算
	[combineActions(...actionsMap(WorkunitCostActions))]: (state = {}, action) => ({
		...state,
		WorkunitCost: WorkunitCostReducer(state.WorkunitCost, action),
	}),
	//安全
	[combineActions(...actionsMap(SafetyActions))]: (state = {}, action) => ({
		...state,
		safety: safetyReducer(state.safety, action),
	}),
	//结算进度
	[combineActions(...actionsMap(SumSpeedCostActions))]: (state = {}, action) => ({
		...state,
		SumSpeedCost: SumSpeedCostReducer(state.SumSpeedCost, action),
	}),
	//结算进度
	[combineActions(...actionsMap(SumPlanCostActions))]: (state = {}, action) => ({
		...state,
		SumPlanCost: SumPlanCostReducer(state.SumPlanCost, action),
	}),
}, {});
